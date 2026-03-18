// Imports
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

// Components
import PostComponent from "../../components/Post";

// Styles
import styles from "./UserPage.module.css";

// Types
import type { User, Post } from "../../types/types";

// Utils
import { fetchSingularUser, fetchPostsByUser } from "../../utils/api";

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter posts based on the search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.body.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [posts, searchQuery]);

  useEffect(() => {
    if (!id) {
      window.location.href = "/";
    }

    (async () => {
      setLoading(true);
      setError(null);

      const userResponse = await fetchSingularUser(id || "");
      if (userResponse.error) {
        setError("Failed to fetch user");
        setLoading(false);
        window.location.href='/'
      }
      setUser(userResponse.data);

      const postsResponse = await fetchPostsByUser(id || "");
      if (postsResponse.error) {
        setError("Failed to fetch posts");
      } else {
        setPosts(postsResponse.data || []);
      }

      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!user) {
    return <div className={styles.error}>User not found</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <div className={styles.avatar}>
            <img
              src={`https://picsum.photos/150/150?random=${user.id}&grayscale`}
              alt={`${user.username} avatar`}
            />
          </div>
          <div className={styles.userInfo}>
            <h1 className={styles.username}>{user.username}</h1>
            <p className={styles.email}>{user.email}</p>
            <p className={styles.description}>
              {user.company.name} - {user.company.catchPhrase}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.details}>
          <button
            className={styles.backButton}
            onClick={() => (window.location.href = "/")}
          >
            Back to all posts
          </button>
          <div className={styles.detailSection}>
            <h2>About</h2>
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={`http://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.website}
              </a>
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Address:</strong> {user.address.street},{" "}
              {user.address.suite}, {user.address.city}, {user.address.zipcode}
            </p>
          </div>

          <div className={styles.detailSection}>
            <h2>Company</h2>
            <p>
              <strong>Name:</strong> {user.company.name}
            </p>
            <p>
              <strong>Catch Phrase:</strong> {user.company.catchPhrase}
            </p>
            <p>
              <strong>Business:</strong> {user.company.bs}
            </p>
          </div>
        </div>

        <div className={styles.postsSection}>
          <h2>
            Posts by {user.username} ({posts.length})
          </h2>
          <div className={styles.search_container}>
            <input
              type="text"
              placeholder={`Search ${user.username}s posts...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.search_input}
            />
            <p className={styles.search__container__results}>
              {filteredPosts.length} results
            </p>
          </div>
          <p className={styles.search__results}>
            {filteredPosts.length} results
          </p>
          {posts.length === 0 ? (
            <p className={styles.noPosts}>No posts found.</p>
          ) : (
            <div className={styles.postsGrid}>
              {filteredPosts.map((post: Post) => (
                <PostComponent key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

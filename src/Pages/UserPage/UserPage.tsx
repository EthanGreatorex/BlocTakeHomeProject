// Imports
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "preact/hooks";
import { mapClassesCurried } from "@blocdigital/useclasslist";

// Components
import PostComponent from "../../components/Post";

// Styles
import styles from "./UserPage.module.css";
const mc = mapClassesCurried(styles, true);

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

  const navigate = useNavigate();

  // Filter posts based on the search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.body.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [posts, searchQuery]);

  useEffect(() => {
    if (!id) navigate("/");

    (async () => {
      setLoading(true);
      setError(null);

      const userResponse = await fetchSingularUser(Number(id));
      if (userResponse.error) {
        setError("Failed to fetch user");
        setLoading(false);
        navigate("/");
      }
      setUser(userResponse.data);

      const postsResponse = await fetchPostsByUser(Number(id));
      if (postsResponse.error) {
        setError("Failed to fetch posts");
      } else {
        setPosts(postsResponse.data || []);
      }

      setLoading(false);
    })();
  }, [id, navigate]);

  if (loading) {
    return <div className={mc("loading")}>Loading...</div>;
  }

  if (error) {
    return <div className={mc("error")}>{error}</div>;
  }

  if (!user) {
    return <div className={mc("error")}>User not found</div>;
  }

  return (
    <div className={mc("container")}>
      <div className={mc("banner")}>
        <div className={mc("bannerContent")}>
          <div className={mc("avatar")}>
            <img
              src={`https://picsum.photos/150/150?random=${user.id}&grayscale`}
              alt={`${user.username} avatar`}
            />
          </div>
          <div className={mc("userInfo")}>
            <h1 className={mc("username")}>{user.username}</h1>
            <p className={mc("email")}>{user.email}</p>
            <p className={mc("description")}>
              {user.company.name} - {user.company.catchPhrase}
            </p>
          </div>
        </div>
      </div>

      <div className={mc("content")}>
        <div className={mc("details")}>
          <Link className={mc("backButton")} to='/'>
            Back to all posts
          </Link>
          <div className={mc("detailSection")}>
            <h2>About</h2>
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={`http://${user.website}`}
                target='_blank'
                rel='noopener noreferrer'
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

          <div className={mc("detailSection")}>
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

        <div className={mc("postsSection")}>
          <h2>
            Posts by {user.username} ({posts.length})
          </h2>
          <div className={mc("search_container")}>
            <input
              type='text'
              placeholder={`Search ${user.username}s posts...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={mc("search_input")}
            />
            <p className={mc("search__container__results")}>
              {filteredPosts.length} results
            </p>
          </div>
          {posts.length === 0 ? (
            <p className={mc("noPosts")}>No posts found.</p>
          ) : (
            <div className={mc("postsGrid")}>
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

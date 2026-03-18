// Imports
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// Styles
import styles from "./PostPage.module.css";

// Types
import { type User, type Post } from "../../types/types";

// Utils
import { fetchSingularPost, fetchSingularUser, fetchPostsByUser } from "../../utils/api";

// Components
import PostComponent from "../../components/Post/PostComponent";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!id) {
      window.location.href = "/";
    }

    (async () => {
      setLoading(true);
      const response = await fetchSingularPost(id || "");

      console.log(response);

      setPost(response.data);

      if (response.error) {
        window.location.href = "/";
      }

      setLoading(false);
    })();
    (async () => {
      const response = await fetchSingularUser(id || "");

      setUser(response.data);

      // Fetch recommended posts after user is set
      if (response.data) {
        const postsResponse = await fetchPostsByUser(response.data.id);
        if (postsResponse.data) {
          const allPosts = postsResponse.data as Post[];
          const filteredPosts = allPosts.filter(p => p.id !== id).slice(0, 4);
          setRecommendedPosts(filteredPosts);
        }
      }
    })();
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!post) {
    return <div className={styles.error}>Post not found</div>;
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={() => (window.location.href = "/")}
      >
        Back to all posts
      </button>
      <div className={styles.post}>
        <div className={styles.post__image}>
          <img
            loading="lazy"
            src={`https://picsum.photos/900/500?random=${post.id}&grayscale`}
            alt="Blog post image"
          ></img>
          <h2 className={styles.post__title}>{post.title}</h2>
          <p className={styles.post__body}>{post.body}</p>
          <div className={styles.author_details}>
            <div className={styles.avatar}>
              <img
                src={`https://picsum.photos/150/150?random=${post.id}&grayscale`}
                alt="Author's profile"
              />
            </div>
            <p
              className={styles.post__author}
              onClick={() => (window.location.href = `/user/${user?.id}`)}
            >
              <a href={`/user/${user?.id}`}>Posted by {user?.username}</a>
            </p>
          </div>
        </div>
      </div>
      <div className={styles.more_posts}>
        <h2 className={styles.more_posts__title}>
          Recommended posts by {user?.username}
        </h2>
        <div className={styles.recommended_posts}>
          {recommendedPosts.map((recPost) => (
            <PostComponent key={recPost.id} post={recPost} />
          ))}
        </div>
      </div>
    </div>
  );
}

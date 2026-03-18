// Imports

// Styles
import styles from "./PostComponent.module.css";

// Types
import type { Post, User } from "../../types/types";
import { useEffect, useState } from "react";
import { fetchSingularUser } from "../../utils/api";

export default function PostComponent({ post }: { post: Post }) {
  // Use states
  const [user, setUser] = useState<User>();

  // Fetch the user details of the post author
  useEffect(() => {
    (async () => {
      const response = await fetchSingularUser(post.userId);
      setUser(response.data);
    })();
  }, []);

  return (
    <>
      <div className={styles.post}>
        <div className={styles.post__image}>
          <img
            loading="lazy"
            src={`https://picsum.photos/300/300?random=${post.id}&grayscale`}
            alt="Blog post image"
            onClick={() => (window.location.href = `/post/${post.id}`)}
          ></img>
        </div>
        <div
          className={styles.post__title}
          onClick={() => (window.location.href = `/post/${post.id}`)}
        >
          <a href={`/post/${post.id}`} aria-label="Go to post">
            {post.title}
          </a>
        </div>
        <div
          className={styles.post__body}
          onClick={() => (window.location.href = `/post/${post.id}`)}
        >
          {post.body}
        </div>
        <div
          className={styles.post__author}
          aria-label="Go to author"
          onClick={() => (window.location.href = `/user/${post.userId}`)}
        >
          <a href={`/user/${post.userId}`}>Posted by {user?.username}</a>
        </div>
      </div>
    </>
  );
}

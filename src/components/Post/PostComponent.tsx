import { useEffect, useState } from "preact/hooks";
import { fetchSingularUser } from "../../utils/api";

// Styles
import { mapClassesCurried } from "@blocdigital/useclasslist";
import styles from "./PostComponent.module.scss";

const mc = mapClassesCurried(styles, true);

import { Link } from "react-router-dom";

// Types
import type { Post, User } from "../../types/types";

export default function PostComponent({ post }: { post: Post }) {
  const [user, setUser] = useState<User | null>(null);

  // Fetch the user details of the post author
  useEffect(() => {
    (async () => {
      const response = await fetchSingularUser(post.userId);
      setUser(response.data);
    })();
  }, [post.userId]);

  if (!user) return <div>Loading</div>;

  return (
    <div className={mc("post")}>
      <Link
        to={`/post/${post.id}`}
        className={mc("post__link")}
        aria-label={`Go to post titled ${post.title}`}
      >
        <div className={mc("post__image")}>
          <img
            loading='lazy'
            src={`https://picsum.photos/300/300?random=${post.id}&grayscale`}
            alt='Blog post image'
          />
        </div>
        <div className={mc("post__title")}>{post.title}</div>
        <div className={mc("post__body")}>{post.body}</div>
      </Link>
      <Link className={mc("post__author")} to={`/user/${post.userId}`}>
        Posted by {user?.username}
      </Link>
    </div>
  );
}

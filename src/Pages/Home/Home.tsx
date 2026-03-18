// Imports
import { useEffect, useState, useMemo, useEffectEvent } from "react";

// Styles
import styles from "./Home.module.css";

// Services
import { fetchAllPosts, fetchAllUsers } from "../../utils/api";

// Components
import PostComponent from "../../components/Post";
import Pagination from "../../components/Pagination";

// Types
import { type User, type Post } from "../../types/types";

// Home page for displaying all the posts
export default function Home() {
  // Use states
  const [allPosts, setAllPosts] = useState<Post[]>([]); // State to hold all posts
  const [allUsers, setAllUsers] = useState<User[]>([]); // Store the users
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [postsPerPage] = useState(6); // Number of posts per page
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  // Fetch all the posts and users on page load
  useEffect(() => {
    (async () => {
      const response = await fetchAllPosts(1,100);
      setAllPosts(response.data || []);
    })();
    (async () => {
      const response = await fetchAllUsers();
      setAllUsers(response.data || []);
    })();
  }, []);

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return allPosts;
    }
    return allPosts.filter((post) => {
      const user = allUsers.find(u => u.id === post.userId);
      return (
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user && user.username.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [allPosts, searchQuery, allUsers]);

  // Calculate pagination for filtered posts
  const totalFilteredPosts = filteredPosts.length;
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to first page when search changes
  const updateCurrentPageOnSearch = useEffectEvent(() => {
    setCurrentPage(1);
  });

  useEffect(() => {
    updateCurrentPageOnSearch();
  }, [searchQuery]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.container__header}>
          <h1>Blog Posts</h1>
          <div className={styles.search_container}>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.search_input}
            />
            <p className={styles.search__container__results}>
              {filteredPosts.length} results
            </p>
            <p className={styles.search__container__results}>
              Page {currentPage}
            </p>
          </div>
        </div>

        {allPosts.length > 0 ? (
          <>
            {currentPosts.length > 0 ? (
              <div className={styles.post_grid}>
                {currentPosts.map((p) => (
                  <div
                    key={p.id}
                    className={styles.post_grid__card}
                    tabIndex={0}
                    aria-label="Go to post"
                  >
                    <PostComponent post={p}></PostComponent>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.no_results}>
                No posts found matching "{searchQuery}"
              </div>
            )}

            {totalFilteredPosts > postsPerPage && (
              <Pagination
                postsPerPage={postsPerPage}
                totalPosts={totalFilteredPosts}
                currentPage={currentPage}
                clickHandle={setCurrentPage}
              />
            )}
          </>
        ) : (
          "Loading..."
        )}
      </div>
    </>
  );
}

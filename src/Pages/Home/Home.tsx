// Imports
import { useEffect, useMemo, useState } from "preact/hooks";
import { mapClassesCurried } from "@blocdigital/useclasslist";

// Styles
import styles from "./Home.module.css";
const mc = mapClassesCurried(styles, true);

// Services
import { fetchAllPosts, fetchAllUsers } from "../../utils/api";

// Components
import PostComponent from "../../components/Post";
import Pagination from "../../components/Pagination";

// Types
import { type User, type Post } from "../../types/types";

const POSTS_PER_PAGE = 12;

// Home page for displaying all the posts
export default function Home() {
  // State
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPosts, setTotalPosts] = useState(0); // server total length of posts

  const isSearching = searchQuery.trim().length > 0;

  // Fetch users on page load
  useEffect(() => {
    (async () => {
      const response = await fetchAllUsers();
      setAllUsers(response.data || []);
    })();
  }, []);

  // This will use server side pagination
  useEffect(() => {
    if (isSearching) return; // skip this when the user is searching

    (async () => {
      const response = await fetchAllPosts(currentPage, POSTS_PER_PAGE);
      setAllPosts(response.data || []);
      setTotalPosts(Number(response.totalCount) || 0);
    })();
  }, [isSearching, currentPage]);

  // When search starts, fetch all the posts
  useEffect(() => {
    if (!isSearching) return;

    (async () => {
      const response = await fetchAllPosts();
      const all = response.data || [];
      setAllPosts(all);
      setTotalPosts(all.length);
      setCurrentPage(1); // reset to first page when search starts
    })();
  }, [isSearching]);

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!isSearching) return allPosts;
    const q = searchQuery.toLowerCase();
    return allPosts.filter((post) => {
      const user = allUsers.find((u) => u.id === post.userId);
      return (
        post.title.toLowerCase().includes(q) ||
        post.body.toLowerCase().includes(q) ||
        (user && user.username.toLowerCase().includes(q))
      );
    });
  }, [allPosts, allUsers, isSearching, searchQuery]);

  const currentPosts = useMemo(() => {
    if (!isSearching) return allPosts;
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
  }, [isSearching, allPosts, filteredPosts, currentPage]);

  // Effective total amount of posts (across all pages)
  const effectiveTotal = isSearching ? filteredPosts.length : totalPosts;

  return (
    <>
      <div className={mc("container")}>
        <div className={mc("container__header")}>
          <h1>Blog Posts</h1>
          <div className={mc("search_container")}>
            <input
              type='text'
              placeholder='Search posts...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={mc("search_input")}
            />
            <p className={mc("search__container__results")}>
              {effectiveTotal} results
            </p>
            <p className={mc("search__container__results")}>
              Page {currentPage}
            </p>
          </div>
        </div>

        {allPosts.length > 0 ? (
          <>
            {currentPosts.length > 0 ? (
              <div className={mc("post_grid")}>
                {currentPosts.map((p) => (
                  <PostComponent key={p.id} post={p} />
                ))}
              </div>
            ) : (
              <div className={mc("no_results")}>
                No posts found matching "{searchQuery}"
              </div>
            )}

            <Pagination
              postsPerPage={POSTS_PER_PAGE}
              totalPosts={effectiveTotal}
              currentPage={currentPage}
              clickHandle={setCurrentPage}
            />
          </>
        ) : (
          "Loading..."
        )}
      </div>
    </>
  );
}

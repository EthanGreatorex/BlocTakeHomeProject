const BASE_URL = "https://jsonplaceholder.typicode.com";

// This is the base function for fetching data fromn the api
async function apiGet({
  endpoint,
  currentPage,
  postsPerPage,
}: {
  endpoint: string;
  currentPage?: number;
  postsPerPage?: number;
}) {
  try {
    let response;
    if (currentPage && postsPerPage) {
      // The API allows for pagination using 'page' and 'limit' attributes.
      response = await fetch(
        `${BASE_URL}/${endpoint}?_page=${currentPage}&_limit=${postsPerPage}`,
      );
    } else {
      response = await fetch(`${BASE_URL}/${endpoint}`);
    }

    const data = await response.json();

    if (response.status === 404) {
      return { error: "404" };
    }
    return { data: data, totalCount: response.headers.get("X-Total-Count") };
  } catch (error) {
    return { error };
  }
}

// GET all posts
export const fetchAllPosts = (currentPage?: number, postsPerPage?: number) =>
  apiGet({ endpoint: "posts", currentPage, postsPerPage });

// GET singular post
export const fetchSingularPost = (id: string) =>
  apiGet({ endpoint: `posts/${id}` });

// GET singular user
export const fetchSingularUser = (id: string) =>
  apiGet({ endpoint: `users/${id}` });

// GET all users
export const fetchAllUsers = () => apiGet({ endpoint: `users` });

// GET all posts made by a user
export const fetchPostsByUser = (id: string) =>
  apiGet({ endpoint: `posts?userId=${id}` });

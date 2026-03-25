const BASE_URL = "https://jsonplaceholder.typicode.com";

// This is the base function for fetching data from the api
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
    const url = new URL(`${BASE_URL}/${endpoint}`);

    if (currentPage && postsPerPage) {
      url.searchParams.append("_page", currentPage.toString());
      url.searchParams.append("_limit", postsPerPage.toString());
    }

    const response = await fetch(url.toString());

    if (response.status === 404) return { error: "404" };

    const data = await response.json();

    return { data: data, totalCount: response.headers.get("X-Total-Count") };
  } catch (error) {
    return { error };
  }
}

// GET all posts
export const fetchAllPosts = (currentPage?: number, postsPerPage?: number) =>
  apiGet({ endpoint: "posts", currentPage, postsPerPage });

// GET singular post
export const fetchSingularPost = (id: number) =>
  apiGet({ endpoint: `posts/${id}` });

// GET singular user
export const fetchSingularUser = (id: number) =>
  apiGet({ endpoint: `users/${id}` });

// GET all users
export const fetchAllUsers = () => apiGet({ endpoint: `users` });

// GET all posts made by a user
export const fetchPostsByUser = (id: number) =>
  apiGet({ endpoint: `posts?userId=${id}` });

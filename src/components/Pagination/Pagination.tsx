// Styles
import styles from "./Pagination.module.css";

interface Props {
  postsPerPage: number;
  totalPosts: number;
  clickHandle: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
}

export default function Pagination({
  postsPerPage,
  totalPosts,
  clickHandle,
  currentPage,
}: Props) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleClick = (e: React.MouseEvent<HTMLElement>, number: number) => {
    e.preventDefault();
    clickHandle(number); // This will set the current page to the click number
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <nav>
      <ul className={styles.pagination}>
        {pageNumbers.map((number) => (
          <div
            className={`${styles.pagination__element}   ${currentPage === number ? styles.active : ""}`}
          >
            <li key={number} className={`${styles.pagination__number}`}>
              <a
                onClick={(e) => handleClick(e, number)}
                href="!#"
                className={`${styles.pagination__link}  ${currentPage === number ? styles.active_text : ""}`}
              >
                {number}
              </a>
            </li>
          </div>
        ))}
      </ul>
    </nav>
  );
}

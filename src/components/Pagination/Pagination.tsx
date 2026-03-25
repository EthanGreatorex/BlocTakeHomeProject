import { useMemo } from "react";

// Styles
import { mapClassesCurried } from "@blocdigital/useclasslist";
import styles from "./Pagination.module.scss";

const mc = mapClassesCurried(styles, true);

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
  const pageNumbers = useMemo(() => {
    const length = Math.ceil(totalPosts / postsPerPage);

    return Array.from({ length }, (_, i) => i + 1);
  }, [totalPosts, postsPerPage]);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const number = Number((e.target as HTMLElement).dataset.page);

    clickHandle(number);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <nav>
      <ul className={mc("pagination")}>
        {pageNumbers.map((number) => (
          <li key={number} className={`${mc("pagination__number")}`}>
            <button
              data-page={number}
              aria-pressed={currentPage === number}
              aria-label={`Go to page ${number}`}
              onClick={handleClick}
              className={mc("pagination__link")}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

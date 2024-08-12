import React from 'react';

interface PaginationProps {
  usersPerPage: number;
  totalUsers: number;
  currentPage: number;
  setCurrentPage: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ usersPerPage, totalUsers, currentPage, setCurrentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="flex justify-center mt-4">
        {pageNumbers.map(number => (
          <li key={number} className="mx-1">
            <button
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 rounded ${
                currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;

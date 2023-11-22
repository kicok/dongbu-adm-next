import React from 'react';
import usePagination from './usePagination';
import PageNumber from './pageNumber';

export type UsePaginationArgs = {
   currentPage: number;
   totalPageCount: number;
   limitPageCount: number;
   onChange: (selectedPage: number) => void;
};
export default function Pagination({ currentPage = 1, totalPageCount, limitPageCount, onChange }: UsePaginationArgs) {
   const { pages, isFirstGroup, isLastGroup, handleClickPage, handleClickLeft, handleClickRight } = usePagination({
      totalPageCount,
      limitPageCount,
      currentPage,
      onChange,
   });

   return (
      <div className="p-24">
         <nav>
            <ul className="flex justify-center items-center -space-x-px h-10 text-base">
               {!isFirstGroup && (
                  <li>
                     <button
                        onClick={handleClickLeft}
                        className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                     >
                        <span className="sr-only">Previous</span>
                        <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                           <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                        </svg>
                     </button>
                  </li>
               )}

               {pages.map((page, index) => (
                  <PageNumber key={page} page={page} selected={page === currentPage} disabled={page === currentPage} onClick={handleClickPage} />
               ))}

               {!isLastGroup && (
                  <li>
                     <button
                        onClick={handleClickRight}
                        className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                     >
                        <span className="sr-only">Next</span>
                        <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                           <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                        </svg>
                     </button>
                  </li>
               )}
            </ul>
         </nav>
      </div>
   );
}

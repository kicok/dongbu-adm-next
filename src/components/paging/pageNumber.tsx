import Link from 'next/link';
import React from 'react';

type Props = {
   page: number; // page number
   selected: boolean;
   disabled: boolean;
   onClick: (event: any) => void;
};

export default function PageNumber({ page, selected, disabled, onClick }: Props) {
   const numberStyle = selected
      ? 'z-10 flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
      : 'flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white';
   return (
      <li>
         <button className={numberStyle} onClick={onClick}>
            {page}
         </button>
      </li>
   );
}

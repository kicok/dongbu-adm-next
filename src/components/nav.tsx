import Link from 'next/link';
import React from 'react';

export default function Nav() {
   return (
      <ul className="mt-3">
         <li className="my-1">
            <Link className="hover:bg-gray-500" href={'/'}>
               Home
            </Link>
            <Link className="hover:bg-gray-500" href={'/products'}>
               Products
            </Link>
            <Link className="hover:bg-gray-500" href={'/create'}>
               Create Product
            </Link>
         </li>
      </ul>
   );
}

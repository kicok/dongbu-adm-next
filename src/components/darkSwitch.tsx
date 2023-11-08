'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
export default function DarkSwitch() {
   const localStorageCheker = (): boolean => {
      if (!localStorage['color-theme']) return false;
      return localStorage['color-theme'] === 'dark' ? true : false;
   };
   const [isDark, setIsDark] = useState(localStorageCheker());
   const darkSetButton = () => {
      setIsDark((state) => {
         const update = !state;
         if (update) {
            localStorage['color-theme'] = 'dark';
         } else {
            localStorage['color-theme'] = 'light';
         }
         return update;
      });
   };

   useEffect(() => {
      if (localStorage['color-theme'] === 'dark') {
         document.documentElement.classList.add('dark');
      } else {
         document.documentElement.classList.remove('dark');
      }
   }, [isDark]);

   return (
      <>
         <span className="animate-spin animate-once" onClick={darkSetButton}>
            {localStorage.getItem('color-theme') === 'dark' ? <MoonIcon width={25} color="white" /> : <SunIcon width={25} color="#000000" />}
         </span>
      </>
   );
}

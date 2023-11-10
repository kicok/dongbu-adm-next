'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
export default function DarkSwitch() {
   const [darkMode, setDarkMode] = useState<boolean | undefined>(undefined);

   const switchMode = () => {
      setDarkMode(!darkMode);
   };

   useEffect(() => {
      if (darkMode) {
         localStorage.setItem('darkMode', 'true');
         window.document.documentElement.classList.add('dark');
      } else if (darkMode === false) {
         localStorage.setItem('darkMode', 'false');
         window.document.documentElement.classList.remove('dark');
      } else {
         setDarkMode(localStorage.getItem('darkMode') === 'false'); // 초기 모드 셋팅
      }
   }, [darkMode]);

   return (
      <>
         <div className="hover:animate-spin" onClick={switchMode}>
            {darkMode ? <MoonIcon width={25} color="white" /> : <SunIcon width={25} color="#000000" />}
         </div>
      </>
   );
}

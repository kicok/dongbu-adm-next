import React from 'react';

export default function EventLayout({ children }: { children: React.ReactNode }) {
   return (
      <div>
         <div className="lg:w-1/2 w-full mt-10 mb-1">
            <h1 className="sm:text-3xl text-xl font-medium title-font mb-2 text-gray-900 dark:text-white">이벤트 팝업</h1>
            <div className="h-1 w-20 bg-indigo-500 rounded"></div>
         </div>
         <div className="mt-16">{children}</div>
      </div>
   );
}

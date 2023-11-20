'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect } from 'react';

// 로그아웃
async function keycloakSessionLogOut() {
   try {
      await fetch(`/api/auth/logout`, { method: 'GET' });
   } catch (err) {
      console.error(err);
   }
}

export default function AuthStatus() {
   const { data: session, status } = useSession();

   useEffect(() => {
      if (status !== 'loading' && session && session?.error === 'RefreshAccessTokenError') {
         signOut({ callbackUrl: '/' });
      }
   }, [session, status]);

   // if (status === 'loading') {
   //    return <div className="ml-3">Loading...</div>;
   // } else
   if (session) {
      // 로그인 이후 사용자 정보 가져오기
      return (
         <div className="ml-3">
            <span>{session.user.name}</span>
            <button
               type="button"
               className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
               onClick={() => {
                  keycloakSessionLogOut().then(() => signOut({ callbackUrl: '/' }));
               }}
            >
               로그아웃
            </button>
         </div>
      );
   }

   return (
      <div className="my-3">
         <button
            type="button"
            className="whitespace-nowrap py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            onClick={() => signIn('keycloak')}
         >
            로그인
         </button>
      </div>
   );
}

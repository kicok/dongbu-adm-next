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
      if (status != 'loading' && session && session?.error === 'RefreshAccessTokenError') {
         signOut({ callbackUrl: '/' });
      }
   }, [session, status]);

   if (status == 'loading') {
      return <div className="my-3">Loading...</div>;
   } else if (session) {
      // 로그인 이후 사용자 정보 가져오기
      return (
         <div>
            <span>{session.user.name}</span>{' '}
            <button
               className="bg-blue-900 font-bold text-white py-1 px-2 rounded border border-gray-50"
               onClick={() => {
                  keycloakSessionLogOut().then(() => signOut({ callbackUrl: '/' }));
               }}
            >
               Log out
            </button>
         </div>
      );
   }

   return (
      <div className="my-3">
         <button className="bg-blue-900 font-bold text-white py-1 px-2 rounded border border-gray-50" onClick={() => signIn('keycloak')}>
            Log in
         </button>
      </div>
   );
}

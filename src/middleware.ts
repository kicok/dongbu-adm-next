// matcher 가 없으면 아래 코드 한 줄은 전체 프로젝트에 next-auth 를 적용한다.
// 즉 로그인 되어있지 않다면 어떤 페이지를 이동해도 로그인 페이지로 이동한다.
// 단 matcher에 등록된 페이지가 있다면 그 페이지를 보호하기 위해 middleware에 의해 next-auth가 적용된다.
// export { default } from 'next-auth/middleware';

import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
   // `withAuth` augments your `Request` with the user's token
   function (request: NextRequestWithAuth) {
      // console.log('pathname', request.nextUrl.pathname);
      // console.log('token', request.nextauth.token);
      // if (request.nextUrl.pathname.startsWith('/extra') && request.nextauth.token?.role !== 'admin') {
      //    return NextResponse.rewrite(new URL('/denied', request.url));
      // }
   },
   {
      callbacks: {
         //  authorized: ({ token }) => token?.role === 'admin"', // true 를 반환한 경우에만 실행됨
         authorized: ({ token }) => !!token,
      },
   }
);

// Applines next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = { matcher: ['/event/:path*', '/banner/:path*'] };

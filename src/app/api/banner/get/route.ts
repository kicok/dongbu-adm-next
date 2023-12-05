import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

//
export async function GET(request: NextRequest) {
   const session = await getServerSession(authOptions);

   if (session) {
      try {
         // id => list || uuid
         const id = request.nextUrl.searchParams.get('id');

         let url = '';

         let searchParams = '';
         if (id === 'list') {
            let params: string[] = [];
            params.push('page=' + request.nextUrl.searchParams.get('page'));
            params.push('useCheck=' + request.nextUrl.searchParams.get('useCheck'));

            searchParams = params.join('&');

            url = `${process.env.BACKEND_URL}/dongbu/banner/list?${searchParams}`;
         } else {
            url = `${process.env.BACKEND_URL}/dongbu/banner/${id}`;
         }
         // console.log('url:: ', url);

         const response = await fetch(url, {
            next: { revalidate: 0 },
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
               // Authorization: 'Bearer ' + accessToken,
            },
         });

         if (!response.ok) {
            throw new Error('eventPop/list : something went to wrong');
         }

         const list = await response.json();

         return new NextResponse(JSON.stringify(list.data), { status: 200 });
      } catch (e) {
         return new NextResponse(null, { status: 500 });
      }
   } else {
      return new NextResponse(null, { status: 403 });
   }
}

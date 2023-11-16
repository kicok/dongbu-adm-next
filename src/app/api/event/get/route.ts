import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

//
export async function GET(request: NextRequest) {
   const session = await getServerSession(authOptions);

   if (session) {
      try {
         const id = request.nextUrl.searchParams.get('id');
         const url = `${process.env.BACKEND_URL}/dongbu/event/${id}`;
         const response = await fetch(url, {
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

import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/utils/sessionTokenAccessor';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
   const session = await getServerSession(authOptions);

   if (session) {
      const accessToken = await getAccessToken();

      const data = await request.json();
      data.flag = process.env.FLAG;

      const url = `${process.env.BACKEND_URL}/dongbu/event`;

      let resp;

      try {
         resp = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
               'Content-Type': 'application/json',
               Authorization: 'Bearer ' + accessToken,
            },
         });
      } catch (err) {
         console.error(err);

         // return NextResponse.json({ status: 500 });
      }

      return NextResponse.json({ status: 200 });
      //  return NextResponse.redirect(new URL('/eventPopup/list', request.url));
   } else {
      return NextResponse.json({ status: 403, response: '권한이 없습니다.' });
   }
}

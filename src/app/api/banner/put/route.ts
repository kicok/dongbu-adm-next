import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getAccessToken } from '@/utils/sessionTokenAccessor';

export async function PUT(request: NextRequest) {
   const session = await getServerSession(authOptions);

   if (session) {
      const accessToken = await getAccessToken();

      const data = await request.json();

      data.flag = process.env.FLAG; // 사이트별 flag 전달

      const url = `${process.env.BACKEND_URL}/dongbu/banner`;

      let resp;

      try {
         resp = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
               'Content-Type': 'application/json',
               Authorization: 'Bearer ' + accessToken,
            },
         });
      } catch (err) {
         console.error(err);
      }

      return NextResponse.json({ status: 200 });
   } else {
      return NextResponse.json({ status: 403, response: '권한이 없습니다.' });
   }
}

import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/utils/sessionTokenAccessor';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PUT(request: NextRequest) {
   const session = await getServerSession(authOptions);

   if (session) {
      const accessToken = await getAccessToken();

      const data = await request.json();

      console.log('data', data);

      // 글삭제 형태로 컬럼 값 수정
      const url = `${process.env.BACKEND_URL}/dongbu/event/delete`;

      try {
         const resp = await fetch(url, {
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

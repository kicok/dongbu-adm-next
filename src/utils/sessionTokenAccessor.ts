import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { decrypt } from './ecryption';

export async function getAccessToken() {
   const session = await getServerSession(authOptions); // 암호화된 세션을 가져온다.
   if (session) {
      const accessTokenDecrypted = decrypt(session.access_token); // 세션을 복호화
      return accessTokenDecrypted;
   }
   return null;
}

export async function getIdToken() {
   const session = await getServerSession(authOptions); // 암호화된 토큰을 가져온다.
   if (session) {
      const idTokenDecrypted = decrypt(session.id_token); // 토큰 복호화
      return idTokenDecrypted;
   }
   return null;
}

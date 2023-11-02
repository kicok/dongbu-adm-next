import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { jwtDecode } from 'jwt-decode';
import type { JWT } from 'next-auth/jwt';
import { encrypt } from '@/utils/ecryption';

// this will refresh an expired access token, when needed
async function refreshAccessToken(token: JWT) {
   const resp = await fetch(`${process.env.REFRESH_TOKEN_URL}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
         client_id: process.env.KEYCLOAK_ID as string,
         client_secret: process.env.KEYCLOAK_SECRET as string,
         grant_type: 'refresh_token',
         refresh_token: token.refresh_token,
      }),
      method: 'POST',
   });
   const refreshToken = await resp.json();
   if (!resp.ok) throw refreshToken;

   return {
      ...token,
      access_token: refreshToken.access_token,
      decoded: jwtDecode(refreshToken.access_token),
      id_token: refreshToken.id_token,
      expires_at: Math.floor(Date.now() / 1000) + refreshToken.expires_in,
      refresh_token: refreshToken.refresh_token,
   };
}

export const authOptions: NextAuthOptions = {
   providers: [
      KeycloakProvider({
         clientId: process.env.KEYCLOAK_ID as string,
         clientSecret: process.env.KEYCLOAK_SECRET as string,
         issuer: process.env.KEYCLOAK_ISSUER,
      }),
   ],

   callbacks: {
      async jwt({ token, account }) {
         const nowTimeStamp = Math.floor(Date.now() / 1000);

         // Persist the OAuth access_token to the token right after signin
         if (account) {
            // account is only available the first time this callbacks is called on a new session
            token.access_token = account.access_token;
            token.decode = jwtDecode(account.access_token as string);
            token.id_token = account.id_token;
            token.expires_in = account.expires_in;
            token.refresh_token = account.refresh_token;
            return token;
         } else if (nowTimeStamp < token.expires_in) {
            return token;
         } else {
            console.log('Token has expired, will refresh');

            try {
               const refreshedToken = await refreshAccessToken(token);
               console.log('Token is refreshed.');
               return refreshedToken;
            } catch (error) {
               console.error('Error refreshing access token', error);
               return { ...token, error: 'RefreshAccessTokenError' };
            }
         }
      },
      async session({ session, token }) {
         // Send properties to the client, like an access_token from a provider.
         //   session.accessToken = token.accessToken
         session.access_token = encrypt(token.access_token); // 암호하해서 저장
         session.id_token = encrypt(token.id_token); // 암호하해서 저장
         session.roles = token.decode.realm_access.roles;
         session.error = token.error;
         return session;
      },
   },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

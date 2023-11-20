'user client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getAccessToken } from '@/utils/sessionTokenAccessor';
import { SetDynamicRoute } from '@/utils/setDynamicRoute';

async function getAllProducts() {
   const url = `${process.env.BACKEND_URL}/restaurant/public/list`;

   let accessToken = await getAccessToken();

   const resp = await fetch(url, {
      headers: {
         'Content-Type': 'application/json',
         Authorization: 'Bearer ' + accessToken,
      },
   });

   if (resp.ok) {
      const data = await resp.json();
      return data;
   }

   throw new Error('Failed to fetch data. Status: ' + resp.status);
}

export default async function Products() {
   const session = await getServerSession(authOptions);

   if (session && session.roles?.includes('admin')) {
      try {
         const products = await getAllProducts();
         console.log('products', products);

         console.log('11');

         return (
            <main>
               <SetDynamicRoute></SetDynamicRoute>
               <h1 className="text-4xl text-center">배너관리</h1>
            </main>
         );
      } catch (err) {
         console.error(err);

         return (
            <main>
               <h1 className="text-4xl text-center">Products</h1>
               <p className="text-red-600 text-center text-lg">Sorry, an error happened. Check the server logs.</p>
            </main>
         );
      }
   }

   redirect('/unauthorized');
}

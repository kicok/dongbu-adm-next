import { getBaseUrl } from '@/utils/getBaseUrl';

export const getBanner = async (id: string) => {
   const response = await fetch(`${getBaseUrl()}/api/banner/get?id=${id}`, {
      next: {
         revalidate: 300, // second
      },
   });

   if (!response.ok) {
      throw new Error('something went to wrong');
   }

   return (await response.json()) as Banner;
};

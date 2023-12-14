import { getBaseUrl } from '@/utils/getBaseUrl';

export const getBannerList = async (page: number, unUse: number) => {
   const response = await fetch(`${getBaseUrl()}/api/banner/get?id=list&page=${page}&unUse=${unUse}`, {
      next: {
         revalidate: 300, // second
      },
   });

   if (!response.ok) {
      throw new Error('something went to wrong');
   }

   return (await response.json()) as BannerPageData;
};

import { getBaseUrl } from '@/utils/getBaseUrl';

export const getEventList = async (page: number, unUse: number) => {
   const response = await fetch(`${getBaseUrl()}/api/event/get?id=list&page=${page}&unUse=${unUse}`, {
      next: {
         revalidate: 300, // second
      },
   });

   if (!response.ok) {
      throw new Error('something went to wrong');
   }

   return (await response.json()) as EventPageData;
};

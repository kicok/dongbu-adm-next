import { getBaseUrl } from '@/utils/getBaseUrl';

export const getEventList = async () => {
   const response = await fetch(`${getBaseUrl()}/api/event/get?id=list`, {
      next: {
         revalidate: 300, // second
      },
   });

   if (!response.ok) {
      throw new Error('something went to wrong');
   }

   return (await response.json()) as EventPopup[];
};

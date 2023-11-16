import { getBaseUrl } from '@/utils/getBaseUrl';
import { String } from 'aws-sdk/clients/acm';

export const getEvent = async (id: string) => {
   const response = await fetch(`${getBaseUrl()}/api/event/get?id=${id}`, {
      next: {
         revalidate: 300, // second
      },
   });

   if (!response.ok) {
      throw new Error('something went to wrong');
   }

   return (await response.json()) as EventPopup;
};

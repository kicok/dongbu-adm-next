'use client';
import { getEvent } from '@/app/api/event/get/getEvent';
import EventWrite from '@/layouts/eventWrite';
import React, { useEffect, useState } from 'react';

export default function Modify({ params }: { params: { id: string } }) {
   const [data, setData] = useState<EventPopup>();
   useEffect(() => {
      const fetchData = async () => {
         const data = await getEvent(params.id);
         setData(data);
      };

      fetchData();
   }, [params.id]);
   return <EventWrite event={data} />;
}

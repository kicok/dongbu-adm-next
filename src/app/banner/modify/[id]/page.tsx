'use client';

import { getBanner } from '@/app/api/banner/get/getBanner';
import BannerWrite from '@/layouts/bannerWrite';

import React, { useEffect, useState } from 'react';

export default function Modify({ params }: { params: { id: string } }) {
   const [data, setData] = useState<Banner>();
   useEffect(() => {
      const fetchData = async () => {
         const data = await getBanner(params.id);
         setData(data);
      };

      fetchData();
   }, [params.id]);
   return <BannerWrite contents={data} />;
}

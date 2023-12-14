'use client';

import { getBanner } from '@/app/api/banner/get/getBanner';
import { deleteBannerS3 } from '@/utils/banner/bannerS3Func';
import { S3BannerUrl, getPosStr } from '@/utils/web-initial';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function BannerPageById({ params }: { params: { id: string } }) {
   const router = useRouter();
   const [data, setData] = useState<Banner>();
   useEffect(() => {
      const fetchData = async () => {
         const res = await getBanner(params.id);
         setData(res);
      };

      fetchData();
   }, [params.id]);

   const deleteCheck = async () => {
      if (confirm('글을 정말 삭제하시겠습니까?')) {
         // s3 서버 배너삭제
         deleteBannerS3(data?.banner as string);

         // 게시글 삭제(컬럼을 삭제상태로 변경)
         const options = {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: params.id, del: true }),
         };
         const res = await fetch('/api/banner/del', options).then((res) => {
            if (res.status === 200) {
               router.push(`/banner/list/1/${data?.unUse ? 1 : ''}`);
            }
         });
      }
   };

   return (
      <div className="w-full">
         <div className="flex justify-between">
            <div className="flex justify-start">
               <button className="btn btn-third text-base mx-5" onClick={deleteCheck}>
                  삭제
               </button>
            </div>
            <div className="flex justify-end">
               <button className="btn btn-primary text-base mx-5" onClick={() => router.push(`/banner/modify/${params.id}`)}>
                  글 수정
               </button>
               <button className="btn btn-primary text-base mx-5" onClick={() => router.push(`/banner/list/1/${data?.unUse ? 1 : ''}`)}>
                  배너 리스트
               </button>
            </div>
         </div>
         {data ? (
            <div className="w-full mb-12  border rounded-lg p-10 my-12">
               <div className="tracking-widest text-indigo-500 dark:text-indigo-200 text-xs font-medium title-font">
                  {data?.unUse ? '사용함' : '사용안함'}
               </div>

               <h1 className="mb-1 text-2xl font-bold  md:leading-tight md:text-3xl">{data?.title}</h1>

               <div className="flex max-md:flex-col mt-2 tracking-widest text-gray-400 dark:text-gray-400 text-xs font-medium title-font">
                  <div className="mr-2">
                     {getPosStr(data.pos)} ({data.pos})
                  </div>
                  <div>
                     {data.startDate} ~ {data.endDate}
                  </div>
               </div>

               <div className="mt-5">{data?.memo}</div>
               <div className="mt-5">
                  <img src={S3BannerUrl + data?.banner} alt={data.title} />
               </div>
               <div className="mt-5 text-base text-right text-gray-500 md:text-lg">수정일: {data?.modifyDate}</div>
            </div>
         ) : (
            <div className="mx-auto">존재하지 않는 게시글입니다.</div>
         )}
      </div>
   );
}

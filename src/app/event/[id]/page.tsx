'use client';

import { getEvent } from '@/app/api/event/get/getEvent';
import { deleteS3, imageListDeleteS3 } from '@/components/editor/sunEditor/SunEditorCustom.func';
import HTMLReactParser from 'html-react-parser';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function EventPageById({ params }: { params: { id: string } }) {
   const router = useRouter();
   const [data, setData] = useState<EventPopup>();
   useEffect(() => {
      const fetchData = async () => {
         const data = await getEvent(params.id);
         setData(data);
      };

      fetchData();
   }, [params.id]);

   const deleteCheck = async () => {
      if (confirm('글을 정말 삭제하시겠습니까?')) {
         if (data?.pos) deleteS3(`events/${data.pos}/`, false); // 이미지 폴더 삭제 => 폴더내의 모든 이미지리스트 삭제
         const options = {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: params.id, del: true }),
         };
         const del = await fetch('/api/event/del', options).then((res) => {
            if (res.status === 200) {
               router.push('/event/list');
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
               <button className="btn btn-primary text-base mx-5" onClick={() => router.push(`/event/modify/${params.id}`)}>
                  글 수정
               </button>
               <button className="btn btn-primary text-base mx-5" onClick={() => router.push(`/event/list/1/${data?.useCheck ? 1 : ''}`)}>
                  이벤트 리스트
               </button>
            </div>
         </div>
         {data ? (
            <div className="w-full mb-12  border rounded-lg p-10 my-12">
               <div className="tracking-widest text-indigo-500 dark:text-indigo-200 text-xs font-medium title-font">
                  {data?.useCheck ? '사용함' : '사용안함'}
               </div>
               <h1 className="mb-1 text-2xl font-bold  md:leading-tight md:text-3xl">{data?.title}</h1>
               <div className="flex max-md:flex-col mt-2 tracking-widest text-gray-400 dark:text-gray-400 text-xs font-medium title-font">
                  <div>
                     {data.startDate} ~ {data.endDate}
                  </div>
               </div>

               <div className="mt-5">{HTMLReactParser(data?.content)}</div>

               <div className="mt-5 text-base text-right text-gray-500 md:text-lg">수정일: {data?.modifyDate}</div>
            </div>
         ) : (
            <div className="mx-auto">존재하지 않는 게시글입니다.</div>
         )}
      </div>
   );
}

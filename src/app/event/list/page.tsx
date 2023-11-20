'use client';

import { getEventList } from '@/app/api/event/get/getEventList';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EventList() {
   const [eventList, setEventList] = useState<EventPopup[]>();

   useEffect(() => {
      const fetchData = async () => {
         const lists = await getEventList();
         setEventList(lists);
      };

      fetchData();
   }, []);

   const router = useRouter();

   // html 태그 제거
   const tagRemove = (value: string) => {
      const content = value.replace(/(<([^>]+)>)/gi, '');
      return content;
   };

   return (
      <div>
         <div className="flex justify-end">
            <button className="btn btn-primary text-base mx-5" onClick={() => router.push('/event/')}>
               이벤트 글쓰기
            </button>
         </div>

         <section className="text-gray-600 body-font">
            <div className="container px-5 py-1 mx-auto">
               <div className="flex flex-wrap w-full mb-20"></div>
               <div className="flex flex-wrap -m-4">
                  {eventList ? (
                     eventList?.map((list) => (
                        <div key={list.id} className="xl:w-1/4 md:w-1/2 p-4">
                           <div
                              className="bg-gray-100 dark:bg-gray-600 p-6 rounded-lg hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-500"
                              onClick={() => router.push('/event/' + list.id)}
                           >
                              <Image
                                 width={720}
                                 height={400}
                                 className="h-40 rounded w-full object-cover object-center mb-6"
                                 src="/img/sample.jpeg"
                                 alt="content"
                              />
                              <h3 className="tracking-widest text-indigo-500 dark:text-indigo-200 text-xs font-medium title-font">
                                 {list.isUse === 0 ? '사용안함' : '사용중'}
                              </h3>
                              <h2 className="text-lg text-gray-900 font-medium title-font mb-4">{list.title}</h2>
                              <p className="truncate leading-relaxed text-base dark:text-white">{tagRemove(list.content)}</p>
                              <div className=" p-2 text-sm text-gray-400 text-end">
                                 <div>시작일 : {list.startDate} </div>
                                 <div>종료일 : {list.endDate} </div>
                                 <div>작성일 : {list.createdDate} </div>
                                 <div>수정일 : {list.modifyDate} </div>
                              </div>
                           </div>
                        </div>
                     ))
                  ) : (
                     <div className="mx-auto dark:text-white">작성된 이벤트가 없습니다.</div>
                  )}
               </div>
            </div>
         </section>
      </div>
   );
}

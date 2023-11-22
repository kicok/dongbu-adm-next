'use client';

import { getEventList } from '@/app/api/event/get/getEventList';
import Pagination from '@/components/paging/pagination';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type Props = {
   params: {
      slug: string[];
   };
};

export default function EventList({ params }: Props) {
   let page = +(params.slug?.[0] ?? 1); // 현재 페이지 number
   let useCheck = +(params.slug?.[1] ?? 0); // [사용중] 이벤트 인지 여부

   const [eventData, setEventData] = useState<EventPageData>();

   const fetchMemoCallback = useCallback(async () => {
      const data = await getEventList(page, useCheck);
      setEventData(data);
   }, [page, useCheck]);

   useEffect(() => {
      fetchMemoCallback();
   }, [fetchMemoCallback]);

   const eventList = eventData?.content;

   const router = useRouter();

   // html 태그 제거
   const tagRemove = (value: string) => {
      const content = value.replace(/(<([^>]+)>)/gi, '');
      return content;
   };

   const tabStyleActive = 'inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500';

   const tabStyle = 'inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300';

   const tabClass = [
      +useCheck === 1 ? tabStyleActive : tabStyle, // [사용중]턉
      +useCheck === 0 ? tabStyleActive : tabStyle, // [사용안함] 탭
   ];

   //  페이지 버튼 클릭 시 url 변경
   const handleChangePage = (page: number) => {
      // useCheck ? 사용함 : 사용안함
      useCheck ? router.push(`/event/list/${page}/1`) : router.push(`/event/list/${page}/0`);
   };

   return (
      <div>
         <div className="flex justify-end">
            <button className="btn btn-primary text-base mx-5" onClick={() => router.push('/event/')}>
               이벤트 글쓰기
            </button>
         </div>
         <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
            <li className="me-2">
               <Link href="/event/list/1/1" aria-current="page" className={tabClass[0]}>
                  사용함
               </Link>
            </li>
            <li className="me-2">
               <Link href="/event/list" className={tabClass[1]}>
                  사용안함
               </Link>
            </li>
         </ul>
         <section className="text-gray-600 body-font">
            <div className="container px-5 py-1 mx-auto">
               <div className="flex flex-wrap w-full mb-20"></div>
               <div className="flex flex-wrap -m-4">
                  {eventList?.length ? (
                     eventList.map((list) => (
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
                                 {list.useCheck ? '사용함' : '사용안함'}
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
                     <div className="mx-auto dark:text-white pb-10">작성된 이벤트가 없습니다.</div>
                  )}
               </div>

               {eventData?.content.length && (
                  <Pagination
                     currentPage={eventData.pageable.pageNumber + 1}
                     //pageNumber는 0부터 시작하기 때문에 +1을 한다.
                     totalPageCount={eventData.totalPages}
                     limitPageCount={eventData.pageable.pageSize}
                     onChange={handleChangePage}
                  />
               )}
            </div>
         </section>
      </div>
   );
}

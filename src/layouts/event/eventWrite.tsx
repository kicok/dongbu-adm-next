'use client';

import { Field, useFormik } from 'formik';

import React, { useEffect, useRef, useState } from 'react';
import { object, string, number, date, InferType } from 'yup';
import dayjs from 'dayjs';
import ReactMultiDatepicker from '@/components/calendars/multiDatepicker/ReactMultiDatepicker';
import SunEditorCustom, { SunEditorCustomType } from '@/components/editor/sunEditor/SunEditorCustom';
import { useRouter } from 'next/navigation';

let validationSchema = object({
   title: string().required('제목은 필수 입력 사항입니다.'),
   content: string().required('내용은 필수 입력 사항입니다.'),
});

export default function EventWrite({ event }: { event?: EventPopup }) {
   const [dates, setDates] = useState<string[] | undefined>();
   const SunEditRef = useRef<SunEditorCustomType>(null);

   // DB에서 호출해온 이벤트 데이터 초기 셋팅
   const [title, setTitle] = useState<string>('');
   const [content, setContent] = useState<string>('');

   const router = useRouter();

   // 새글 작성시 이벤트 기간 설정
   const toParentEventDates = (value: string[] | undefined) => {
      setDates(value);
   };

   useEffect(() => {
      // 새글작성시 디폴트 이벤트 기간 설정
      if (!event) {
         const today = dayjs();
         const todayStr = today.add(0, 'day').format('YYYY-MM-DD');
         const tomorrowStr = today.add(2, 'day').format('YYYY-MM-DD');
         setDates([todayStr, tomorrowStr]);
      }
   }, [event]);

   const formik = useFormik({
      initialValues: {
         title: '',
         startDate: '',
         endDate: '',
         content: '',
      },

      validationSchema: validationSchema,

      // 값 변경시마다 validation 체크
      validateOnChange: true,

      // 인풋창 블러시에 validation 체크
      validateOnBlur: true,

      // validation 체크할 함수
      //  validate: validator

      onSubmit: async (values) => {
         console.log(JSON.stringify(values));

         const options = {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
         };

         const data = await fetch('/api/event', options)
            // .then((res) => res.json())
            // .then((res) => console.log(res))
            .then((res) => {
               if (res.status === 200) {
                  // redirect('/eventPopup/list'); // not working
                  // router.replace('/eventPopup/list');
                  router.push('/event/list');
               }
            });
      },
   });

   const submitForm = (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();

      let val = SunEditRef.current?.SunEditorCustomGetValue(); // 에디터 value
      val = val === '<p><br></p>' ? '' : val;

      formik.setFieldValue('content', val);

      if (dates) {
         formik.setFieldValue('startDate', dates[0]);
         formik.setFieldValue('endDate', dates[1]);
      }

      formik.handleSubmit();
   };

   // 글 수정할때 페이지 로딩시 데이터 초기화
   useEffect(() => {
      if (event) {
         setTitle(event.title);
         formik.setFieldValue('title', event.title);
         setContent(event.content);
         setDates([event.startDate, event.endDate]);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [event]);

   if (formik.touched.title && Boolean(formik.errors.title)) {
      console.log('touch');
   }
   return (
      <div>
         <div className="flex justify-end">
            <button className="btn btn-primary text-base mx-5" onClick={() => router.push('/event/list')}>
               이벤트 리스트
            </button>
         </div>

         <form onSubmit={submitForm} className="my-20">
            <div>
               <div className="flex max-md:flex-col">
                  <div className="w-40">이벤트 기간</div>
                  <div className="w-full">
                     <ReactMultiDatepicker toParentEventDates={toParentEventDates} dates={dates} />
                  </div>
               </div>
               <div className="flex max-md:flex-col">
                  <div className="w-40">제 목</div>
                  <div className="w-full">
                     <input
                        className="w-full"
                        id="title"
                        name="title"
                        placeholder="제목"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                     />
                     <span className="w-full text-red-500 text-sm">{formik.touched.title && formik.errors.title}</span>
                  </div>
               </div>

               {dates !== undefined && <input name="startDate" type="hidden" />}
               {dates !== undefined && <input name="endDate" type="hidden" />}
               <input name="content" type="hidden" />

               <SunEditorCustom ref={SunEditRef} dbContent={content} />
               <span className="w-full text-red-500 text-sm">{formik.touched.content && formik.errors.content}</span>
               <div className="flex justify-end">
                  <button type="submit" className="btn btn-third my-10">
                     글 등록
                  </button>
               </div>
            </div>
         </form>
      </div>
   );
}

'use client';

import { Field, useFormik } from 'formik';

import React, { useEffect, useRef, useState } from 'react';
import { object, string, number, date, InferType } from 'yup';
import dayjs from 'dayjs';
import ReactMultiDatepicker from '@/components/calendars/multiDatepicker/ReactMultiDatepicker';
import SunEditorCustom, { SunEditorCustomType } from '@/components/editor/sunEditor/SunEditorCustom';
import { redirect, useRouter } from 'next/navigation';

let validationSchema = object({
   title: string().required('제목은 필수 입력 사항입니다.'),
});

export default function EventWrite() {
   const [dates, setDates] = useState<string[] | undefined>();
   const SunEditRef = useRef<SunEditorCustomType>(null);

   const router = useRouter();

   // 이벤트 기간 설정
   const toParentEventDates = (value: string[] | undefined) => {
      setDates(value);
   };

   useEffect(() => {
      // 디폴트 이벤트 기간 설정
      const today = dayjs();
      const todayStr = today.add(0, 'day').format('YYYY-MM-DD');
      const tomorrowStr = today.add(2, 'day').format('YYYY-MM-DD');
      setDates([todayStr, tomorrowStr]);
   }, []);

   const formik = useFormik({
      initialValues: {
         title: '',
         startDate: '',
         endDate: '',
      },

      validationSchema: validationSchema,
      onSubmit: async (values: {}) => {
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

      const val = SunEditRef.current?.SunEditorCustomGetValue(); // 에디터 value
      formik.setFieldValue('content', val);

      if (dates) {
         formik.setFieldValue('startDate', dates[0]);
         formik.setFieldValue('endDate', dates[1]);
      }

      formik.handleSubmit();
   };

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
                        //    value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        //   error={formik.touched.title && Boolean(formik.errors.title)}
                        //   helperText={formik.touched.title && formik.errors.title}
                     />
                  </div>
               </div>

               {dates !== undefined && <input name="startDate" type="hidden" />}
               {dates !== undefined && <input name="endDate" type="hidden" />}
               <input name="content" type="hidden" />

               <SunEditorCustom ref={SunEditRef} />
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

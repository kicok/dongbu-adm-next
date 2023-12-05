'use client';

import { useFormik } from 'formik';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { object, string } from 'yup';
import dayjs from 'dayjs';
import ReactMultiDatepicker from '@/components/calendars/multiDatepicker/ReactMultiDatepicker';
import { useRouter } from 'next/navigation';
import Toggle from '@/components/toggle';
import S3BannerUploadForm from '@/components/S3BannerUploadForm';
import { getPosStr } from '@/utils/web-initial';
import { changeBannerS3, moveBannerS3 } from '@/utils/banner/bannerS3Func';

let validationSchema = object({
   title: string().required('제목은 필수 입력 사항입니다.'),
   banner: string().required('배너에 등록할 이미지 파일을 등록해주세요.'),
});

export default function BannerWrite({ contents }: { contents?: Banner }) {
   const [dates, setDates] = useState<string[] | undefined>();
   const [useCheck, setUseCheck] = useState<boolean>(true);
   const [useCheckMsg, setUseCheckMsg] = useState<string>('사용함');

   const [s3file, setS3file] = useState<string>('');
   const [pos, setPos] = useState<string>('');

   const S3FormRef = useRef<HTMLFormElement>(null);

   const router = useRouter();

   // 새글 작성시 배너 기간 설정
   const toParentEventDates = (value: string[] | undefined) => {
      setDates(value);
   };

   useEffect(() => {
      // 새글작성시 디폴트 배너 기간 설정
      if (!contents) {
         const today = dayjs();
         const todayStr = today.add(0, 'day').format('YYYY-MM-DD');
         const tomorrowStr = today.add(2, 'day').format('YYYY-MM-DD');
         setDates([todayStr, tomorrowStr]);
      }
   }, [contents]);

   const formik = useFormik({
      initialValues: {
         title: '',
         banner: '',
         pos: '',
         startDate: '',
         endDate: '',
         memo: '',
      },

      validationSchema: validationSchema,
      validateOnChange: true, // 값 변경시마다 validation 체크
      validateOnBlur: true, // 인풋창 블러시에 validation 체크
      // validation 체크할 함수
      //  validate: validator

      onSubmit: async (values) => {
         console.log(JSON.stringify(values));

         try {
            // 기존의 배너를 다른 위치로 이동시킨다.(이미지와 이미지명은 그대로)
            if (contents?.banner) moveBannerS3(contents.banner, s3file);

            // 기존의 배너를 다른 이미지로 변경한다 (이미지와 이미지 이름이 변경되고 위치변경 있을수 있음)
            if (contents?.banner) changeBannerS3(contents.banner, s3file);
         } catch (error) {
            console.log('copy~~~ error', JSON.stringify(error));
            return;
         }

         const options = {
            method: contents ? 'PUT' : 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
         };

         //신규 글쓰기 : /api/banner/
         //글수정 : /api/banner/put
         const url = contents ? '/api/banner/put' : '/api/banner/';
         const data = await fetch(url, options).then((res) => {
            if (res.status === 200) {
               router.push('/banner/list/1/1');
            } else {
               //
            }
         });
      },
   });

   const submitForm = (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();

      // 배너를 신규등록또는 수정할때 이미지 s3 업로드 form을 submit 한다.
      // if (!contents)
      S3FormRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

      // useCheck 값을 가져온다.
      getContent();

      if (dates) {
         formik.setFieldValue('startDate', dates[0]);
         formik.setFieldValue('endDate', dates[1]);
      }

      // 새글 등록시 banner 에 등록할 s3file은
      // S3BannerUploadForm 에서 전달 받기 때문에 이런식으로는 호출안되서 별도로 호출한다.
      // if (s3file) {
      //    formik.setFieldValue('banner', s3file);
      // }

      formik.handleSubmit();
   };

   // DB에서 호출해온 배너 데이터 초기 셋팅
   // 글 수정할때 페이지 로딩시 데이터 초기화
   useEffect(() => {
      if (contents) {
         formik.setFieldValue('id', contents.id); // 글 수정시에 필요한 id (uuid)
         formik.setFieldValue('title', contents.title);
         formik.setFieldValue('banner', contents.banner);
         formik.setFieldValue('pos', contents.pos);
         formik.setFieldValue('memo', contents.memo);
         setDates([contents.startDate, contents.endDate]);
         setUseCheck(contents.useCheck);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [contents]);

   if (formik.touched.title && Boolean(formik.errors.title)) {
      console.log('touch');
   }

   const getContent = () => {
      //validate 체크를 위해서 값을 총 두번 가져와야 한다.
      // 글 등록 버튼 onClick 이벤트때 한번
      // 바로 직후 submit 할때 한번 더 ...

      formik.setFieldValue('useCheck', useCheck);
   };

   useEffect(() => {
      useCheck ? setUseCheckMsg('사용함') : setUseCheckMsg('사용안함');
   }, [useCheck]);

   const handleToggle = () => {
      setUseCheck((check) => !check);
   };

   const parentToValue = (val: string) => {
      if (val) {
         // 파일 브라우져창에서 파일을 선택했을때
         setS3file(val);

         // 배너 위치를 분류한다.
         const arr = val.split('/');
         setPos(arr[0]);
      } else {
         // 파일 브라우져창에서 파일선택을 취소했을때
         if (!contents?.banner) {
            setS3file('');
            setPos('');
         }
      }
   };

   const bannerMemo = useCallback(() => {
      formik.setFieldValue('banner', s3file);
      formik.setFieldValue('pos', pos);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [s3file, pos]);

   useEffect(() => {
      bannerMemo();
   }, [bannerMemo]);

   return (
      <div>
         <div className="flex justify-end">
            <button className="btn btn-primary text-base mx-5" onClick={() => router.push('/banner/list')}>
               배너 리스트
            </button>
         </div>
         <S3BannerUploadForm
            ref={S3FormRef}
            parentToValue={parentToValue}
            imgUrl={contents && contents.banner} // contents 가 있을때만 imgUrl을 전송한다.
         />

         <form onSubmit={submitForm}>
            <div>
               <div className="flex max-md:flex-col mt-[-5px]">
                  <div className="w-40"></div>
                  <div className="w-full">
                     <span className="w-full text-red-500 text-sm">{formik.touched.banner && formik.errors.banner}</span>
                  </div>
               </div>

               <div className="flex max-md:flex-col mt-7">
                  <div className="w-40">위치코드</div>
                  <div className="w-full">
                     <input
                        className="w-auto"
                        id="pos"
                        name="pos"
                        placeholder="배너위치 코드"
                        value={pos}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        readOnly={true}
                     />
                     <span className="ml-2">{getPosStr(formik.values.pos)}</span>
                  </div>
               </div>
               <div className="flex max-md:flex-col mt-5">
                  <div className="w-40">배 너</div>
                  <div className="w-full">
                     <input
                        className="w-full"
                        id="banner"
                        name="banner"
                        placeholder="배너경로 표시"
                        value={formik.values.banner}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        readOnly={true}
                     />
                  </div>
               </div>

               <div className="flex max-md:flex-col mt-5">
                  <div className="w-40">배너 노출기간</div>
                  <div className="w-full">
                     <ReactMultiDatepicker toParentEventDates={toParentEventDates} dates={dates} />
                  </div>
               </div>
               <div className="flex max-md:flex-col mt-5">
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

               <div className="flex max-md:flex-col mt-5">
                  <div className="w-40">메 모</div>
                  <div className="w-full">
                     <input
                        className="w-full"
                        id="memo"
                        name="memo"
                        placeholder="메모"
                        value={formik.values.memo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                     />
                     <span className="w-full text-red-500 text-sm">{formik.touched.memo && formik.errors.memo}</span>
                  </div>
               </div>

               <div className="flex max-md:flex-col mt-5">
                  <div className="w-40">사용 여부</div>
                  <div className="w-full">
                     <Toggle useCheck={useCheck} onChange={handleToggle} msg={useCheckMsg} />
                  </div>
               </div>

               {dates !== undefined && <input name="startDate" type="hidden" />}
               {dates !== undefined && <input name="endDate" type="hidden" />}

               <div className="flex justify-end">
                  <button type="submit" className="btn btn-third my-10" onClick={getContent}>
                     글 등록
                  </button>
               </div>
            </div>
         </form>
      </div>
   );
}

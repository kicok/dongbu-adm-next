'use client';

import { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import RadioBtn from './radioBtn';
import { S3BannerUrl, bannerPositionObj } from '@/utils/web-initial';
import Image from 'next/legacy/image';
import { makeNewFileName } from '@/utils/func';

type Props = {
   parentToValue: (val: string) => void;
   imgUrl?: string;
};

const S3BannerUploadForm = forwardRef(({ parentToValue, imgUrl }: Props, ref: ForwardedRef<HTMLFormElement>) => {
   const [file, setFile] = useState<File | null>();
   const [position, setPosition] = useState<string>('carousel'); // 라디오 버튼 선택시 위치 값 (radioChange와 연동)
   const [defaultCheckPos, setDefaultCheckPos] = useState<string | null>(null); // 글수정할때 라디오 버튼 디비 저장값 전달
   const [preview, setPreview] = useState<string | null>('');
   const [uploading, setUploading] = useState(false);
   const [newFileName, setNewFileName] = useState('');

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!file) return;

      setUploading(true);

      const formData = new FormData();

      formData.append('file', file);
      formData.append('position', position);

      try {
         const response = await fetch('/api/banner-s3', {
            method: 'POST',
            body: formData,
         });

         const data = await response.json();

         setUploading(false);
      } catch (error) {
         console.log(error);
         setUploading(false);
      }
   };
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('dddd');
      if (e.target.files) {
         const sourceFile = e.target.files[0];

         // 파일 디렉토리 창에서 파일을 선택도중 취소한 상태
         if (sourceFile === undefined) {
            setFile(null);
            setPreview('');
            setNewFileName('');
            parentToValue('');

            return;
         }

         const newFname = makeNewFileName(sourceFile.name);

         console.log('newFname', newFname);

         setNewFileName(newFname);

         const newFile = new File([sourceFile], newFname); // File생성자를 이용해서 oldFile의 이름을 newFName 으로 변경

         setFile(newFile);

         parentToValue(position + '/' + newFname);
      } else {
         parentToValue('');
      }
   };

   useEffect(() => {
      if (file) {
         // 새글 작성시 업로드할 이미지 미리보기
         const reader = new FileReader();
         reader.onloadend = () => {
            setPreview(reader.result as string);
         };
         reader.readAsDataURL(file);
      } else {
         setPreview(null);
      }
   }, [file]);

   const radioChange = (val: string) => {
      setPosition(val);
   };

   useEffect(() => {
      // 부모에게 s3에 업로드된 디렉토리경로와 파일명을 전달한다.

      if (file) {
         // 이미지 파일 신규 등록
         parentToValue(position + '/' + newFileName);
      } else if (imgUrl) {
         // 기존 이미지 파일을 다른 위치로 이동할때(다른위치로 카피 이후 원래 위치의 파일은 삭제)
         // 파일명은 그대로 유지한채 폴더위치만 바꾼다.
         parentToValue(position + '/' + imgUrl.split('/')[1]);
      } else {
         parentToValue('');
      }
   }, [position, newFileName, parentToValue, file, imgUrl]);

   useEffect(() => {
      if (imgUrl) {
         setPosition(imgUrl.split('/')[0]);
         setDefaultCheckPos(imgUrl.split('/')[0]);
      }
   }, [imgUrl]);

   return (
      <div className="mt-10">
         <form onSubmit={handleSubmit} ref={ref}>
            <RadioBtn arr={bannerPositionObj} defaultCheckPos={defaultCheckPos} radioChange={radioChange} />

            <div className="mt-5">
               {imgUrl && (
                  <div className="flex max-md:flex-col mt-5">
                     <div className="w-40">{preview && <span>현재 </span>}이미지</div>
                     <div className="relative h-[200px] min-w-[200px]">
                        <Image alt="preview" src={S3BannerUrl + imgUrl} objectFit="contain" objectPosition="center" priority layout="fill" />
                     </div>
                  </div>
               )}
               {preview && (
                  <div className="flex max-md:flex-col mt-5">
                     <div className="w-40">{imgUrl && <span>변경될 </span>}이미지</div>
                     <div className="relative h-[200px] min-w-[200px]">
                        <Image alt="preview" src={preview} objectFit="contain" objectPosition="center" priority layout="fill" />
                     </div>
                  </div>
               )}
            </div>
            <div className="flex max-md:flex-col mt-5">
               <div className="w-40">업로드 파일</div>
               <div className="w-full">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="max-w-lg" />
                  <span className="ml-2">{uploading ? 'uploading...' : ''}</span>
               </div>
            </div>
         </form>
      </div>
   );
});

S3BannerUploadForm.displayName = 'S3UploadForm';

export default S3BannerUploadForm;

'use client';

import { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import RadioBtn from './radioBtn';
import replaceAt from '@/utils/replaceAt';
import { S3BannerUrl, bannerPositionObj } from '@/utils/web-initial';
import Image from 'next/image';

type Props = {
   parentToValue: (val: string) => void;
   imgUrl?: string;
};

const S3BannerUploadForm = forwardRef(({ parentToValue, imgUrl }: Props, ref: ForwardedRef<HTMLFormElement>) => {
   const [file, setFile] = useState<File | null>();
   const [position, setPosition] = useState<string>('carousel');
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
      if (e.target.files) {
         const oldFile = e.target.files[0];

         if (oldFile === undefined) {
            setFile(null);
            setPreview('');
            setNewFileName('');
            parentToValue('');

            return;
         }

         let fileName = oldFile.name;

         const max = 99999999999;
         const min = 1;

         const index = fileName.lastIndexOf('.');
         const replaceStr = `-${Date.now()}${Math.floor(Math.random() * (max - min) + min)}.`;
         const newFName = replaceAt(fileName, index, replaceStr);

         setNewFileName(newFName);

         const newFile = new File([oldFile], newFName); // File생성자를 이용해서 oldFile의 이름을 newFName 으로 변경

         setFile(newFile);

         parentToValue(position + '/' + newFName);
      } else {
         parentToValue('');
      }
   };

   useEffect(() => {
      if (file) {
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
      if (file) parentToValue(position + '/' + newFileName);
      else parentToValue('');
   }, [position, newFileName, parentToValue, file]);

   return (
      <div className="mt-10">
         <form onSubmit={handleSubmit} ref={ref}>
            {!imgUrl && <RadioBtn arr={bannerPositionObj} checkedPos="carousel" radioChange={radioChange} />}

            <div className="mt-5">
               <div className="flex max-md:flex-col mt-5">
                  {(preview || imgUrl) && <div className="w-40">이미지</div>}
                  <div className="w-full">
                     {preview && <Image alt="preview" src={preview} width={230} height={230} />}

                     {imgUrl && <Image alt="preview" src={S3BannerUrl + imgUrl} width={230} height={230} />}
                  </div>
               </div>
            </div>
            {!imgUrl && (
               <div className="flex max-md:flex-col mt-5">
                  <div className="w-40">업로드 파일</div>
                  <div className="w-full">
                     <input type="file" accept="image/*" onChange={handleFileChange} className="max-w-lg" />
                  </div>
               </div>
            )}

            <button type="submit">{uploading ? 'uploading...' : ''}</button>
         </form>
      </div>
   );
});

S3BannerUploadForm.displayName = 'S3UploadForm';

export default S3BannerUploadForm;

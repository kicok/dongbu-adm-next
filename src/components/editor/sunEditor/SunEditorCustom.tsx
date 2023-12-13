'use client';
import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import dynamic from 'next/dynamic';
import SunEditorCore from 'suneditor/src/lib/core';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import { UploadBeforeHandler, UploadInfo } from 'suneditor-react/dist/types/upload';
import { makeNewFileName, makeRandomStr } from '@/utils/func';
import { S3Url } from '@/utils/web-initial';
import { buttonList, imgDelCheck, imgFormUpload } from './SunEditorCustom.func';

const SunEditor = dynamic(() => import('suneditor-react'), {
   ssr: false,
});

export type SunEditorCustomType = {
   SunEditorCustomGetValue: () => string;
   SunEditorCustomGetImgPos: () => string;
};

type Props = {
   dirName: string; // s3서버에 이미지 업로드시 사용할 게시판 고유 디렉토리 명
   pos?: string; // s3서버에 이미지 업로드시 사용할 게시글 각각의 고유 디렉토리 명 dirName/pos/img.png
   dbContent?: string;
};

const SunEditorCustom = forwardRef<SunEditorCustomType, Props>((props, ref) => {
   const editor = useRef<SunEditorCore>();
   const [value, setValue] = useState('');
   const [imgPos, setImpPos] = useState(makeRandomStr(10)); // 새글 작성시 생성
   const [imgDataArr, setImgDataArr] = useState<string[]>([]);

   // The sunEditor parameter will be set to the core suneditor instance when this function is called
   const getSunEditorInstance = (sunEditor: SunEditorCore) => {
      editor.current = sunEditor;
   };

   const handleChange = (content: string) => {
      setValue(content);
   };

   useImperativeHandle(ref, () => ({
      SunEditorCustomGetValue,
      SunEditorCustomGetImgPos,
   }));

   // 이미지마다 등록될 경로 (게시글마다 한개의 경로가 생성)
   useEffect(() => {
      if (props.pos) {
         setImpPos(props.pos); // 디비에서 가져온 경로
      }
   }, [props.pos, imgPos]);

   // 외부에서 submit이 실행될때 함수가 실행되어 editor에서 작성된 텍스트를 반환한다.
   const SunEditorCustomGetValue = () => {
      // 저장하기 전에 이미지의 처음과 마지막 상태를 비교 체크하여 없는 이미지는 삭제한다.
      // handleOnlyImageUploadBefore 함수에서 이미지를 s3에 업로드하고 (추가로직)
      // handleOnlyImageArrPush 함수에서 imgDataArr 에 이미지를 push 하는 로직이라면 (추가로직)
      // 이 imgDelCheck 함수는 무조건 삭제만 하는 로직
      const imgPath = props.dirName + '/' + imgPos + '/';
      imgDelCheck(value, imgDataArr, imgPath);

      // editor에서 작성된 텍스트를 반환한다.
      return value;
   };
   const SunEditorCustomGetImgPos = () => imgPos;

   const getPos = () => {
      // 외부에서 props.pos 가 전달되면 그 값으로 setImpPos 를 실행한다.
      if (props.pos && imgPos !== props.pos) setImpPos(props.pos);
   };

   getPos(); // 외부에서 props.pos값이 통신 상태에 따라 늦게 전달되므로 값을 계속 전달 받기위해 함수를 실행

   // editor가 새로 loading 될때 이미지가 있다면 실행됨 ( state === 'create')
   // editor에 이미지가 신규 등록될때 ( state === 'create') 실행됨
   // 실제 s3에 이미지 업로드는 handleImageUploadBefore 함수에서 실행하므로
   // 이 함수는 setImgDataArr(...) 를 실행하여 "기존 또는 신규로 s3에 등록된 이미지"를 imgDataArr에 push 하는 역할을 담당
   // 이미지가 editor에서 삭제되면 (state === 'delete') 상태로 함수가 실행되지만 여기서는 이미지 삭제로직을 두지 않는다.
   // editor를 작성하는 과정에서 이미지 변경(추가,삭제)는 빈번하게 일어날수 있으므로 그때그때마다 삭제 로직을 실행한다면 효율이 떨어질수 있기 때문
   const handleOnlyImageArrPush = (
      targetImgElement: HTMLImageElement,
      index: number,
      state: 'create' | 'update' | 'delete',
      imageInfo: UploadInfo<HTMLImageElement>,
      remainingFilesCount: number
   ) => {
      if (state === 'create') {
         setImgDataArr((prevDataArr) => [...prevDataArr, imageInfo.src]);
      }
   };

   // 이미지가 editor에 새로 등록될때마다 실행
   // 즉 editor에 추가된 이미지를 s3에 추가 업로드 하는 역할을 한다. (이 함수는 업로드만 하고 삭제는 하지 않음)
   const handleOnlyImageUploadBefore = (files: Array<File>, info: object, uploadHandler: UploadBeforeHandler) => {
      const uploadingImg = async (files: Array<File>) => {
         const imgObjArr = await Promise.all(
            files.map((file, k) => {
               const formData = new FormData();
               const newFileName = makeNewFileName(file['name']);

               formData.append('file', file, newFileName);
               formData.append('position', props.dirName + '/' + imgPos);

               return imgFormUpload(formData);
            })
         );

         imgObjArr.forEach((imgInfo) => {
            if (imgInfo.success) {
               editor.current?.insertHTML(`<img src="${S3Url}${imgInfo.fileName}"/>`, true, true);
            }
         });
      };

      uploadingImg(files);

      return false;
      // 업로드시 반드시 flase 로 리턴 해야 onImageUpload 에 해당되는 함수가 실행되지 않는다.
      // 업로드시 onImageUpload 함수가 실행되면 suneditor 버그가 있어서 한번에 여러개의 파일 업로드가 되지 않음
      // 그러므로 현재 코딩 상태에서는 반드시 flase 를 리턴해야 함

      // return값에 관계없이 수정페이지에서 이미지 태그가 있을때 처음 로딩시 onImageUpload 는 자동실행되므로 status값에 따라 처리 가능
   };

   return (
      <div>
         <SunEditor
            getSunEditorInstance={getSunEditorInstance}
            setContents={props.dbContent}
            placeholder="내용을 입력하세요"
            onChange={handleChange}
            height="50vh"
            setOptions={{
               buttonList: buttonList,
            }}
            onImageUpload={handleOnlyImageArrPush}
            onImageUploadBefore={handleOnlyImageUploadBefore}
         />
         <button onClick={SunEditorCustomGetValue}>확인</button>
      </div>
   );
});

SunEditorCustom.displayName = 'SunEditor';

export default SunEditorCustom;

'use client';
import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
// import SunEditor from 'suneditor-react';
import SunEditorCore, { fileInfo } from 'suneditor/src/lib/core';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import { UploadBeforeHandler, UploadInfo } from 'suneditor-react/dist/types/upload';
import { makeNewFileName, makeRandomStr } from '@/utils/func';
import { S3Url } from '@/utils/web-initial';

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

   useEffect(() => {
      if (props.pos) {
         setImpPos(props.pos); // 디비에서 가져온 경로
      }
   }, [props.pos, imgPos]);

   const SunEditorCustomGetValue = () => value;
   const SunEditorCustomGetImgPos = () => imgPos;

   const getPos = () => {
      // 외부에서 props.pos 가 전달되면 그 값으로 setImpPos 를 실행한다.
      if (props.pos && imgPos !== props.pos) setImpPos(props.pos);
   };

   getPos(); // 외부에서 props.pos값이 통신 상태에 따라 늦게 전달되므로 값을 계속 전달 받기위해 함수를 실행

   const imgFormUpload = async (formData: FormData) => {
      console.log('formData', formData.get('file'));
      const response = await fetch('/api/wysiwyg-s3', {
         method: 'POST',
         body: formData,
      });

      if (response.status === 200) return await response.json();
      else '';
   };

   const imageHandler = (
      targetImgElement: HTMLImageElement,
      index: number,
      state: 'create' | 'update' | 'delete',
      imageInfo: UploadInfo<HTMLImageElement>,
      remainingFilesCount: number
   ) => {
      console.log('targetImgElement', targetImgElement);
      console.log('index', index);
      console.log('state', state);
      console.log('imageInfo', imageInfo);
      console.log('remainingFilesCount', remainingFilesCount);

      // console.log('imgArr.length ', imgArr.length);
      if (state === 'delete') {
         console.log('delete imageInfo src::::', imageInfo);
         console.log('delete targetImgElement src::::', targetImgElement);
         console.log('delete index src::::', index);
      }

      // return;
   };

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

   const handleImageUploadBefore = (files: Array<File>, info: object, uploadHandler: UploadBeforeHandler) => {
      uploadingImg(files);

      return false;
      // 업로드시 반드시 flase 로 리턴 해야 onImageUpload 에 해당되는 함수가 실행되지 않는다.
      // 업로드시 onImageUpload 함수가 실행되면 suneditor 버그가 있어서 한번에 여러개의 파일 업로드가 되지 않음
      // 그러므로 현재 코딩 상태에서는 반드시 flase 를 리턴해야 함

      // return값에 관계없이 수정페이지에서 이미지 태그가 있을때 처음 로딩시 onImageUpload 는 자동실행되므로 status값에 따라 처리 가능
   };

   const buttonList = [
      // default
      ['undo', 'redo'],
      [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['fontColor', 'hiliteColor', 'textStyle'],
      ['removeFormat'],
      ['outdent', 'indent'],
      // ['imageGallery'],
      ['align', 'horizontalRule', 'list', 'lineHeight'],
      ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print', 'save'],
      ['-right', ':r-More Rich-default.more_plus', 'table'],
      ['-right', 'image', 'video', 'audio', 'link'],
   ];

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
            onImageUpload={imageHandler}
            onImageUploadBefore={handleImageUploadBefore}
         />
      </div>
   );
});

SunEditorCustom.displayName = 'SunEditor';

export default SunEditorCustom;

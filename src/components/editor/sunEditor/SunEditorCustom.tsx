import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
// import AWS from 'aws-sdk';
import SunEditor from 'suneditor-react';
import SunEditorCore from 'suneditor/src/lib/core';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import { UploadBeforeHandler } from 'suneditor-react/dist/types/upload';

const REGION = process.env.REACT_APP_AWS_S3_BUCKET_REGION;
const ACCESS_KEY = process.env.REACT_APP_AWS_S3_BUCKET_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_S3_BUCKET_SECRET_ACCESS_KEY;
const CLOUD_FRONT_URL = ''; //배포한 CloudFront URI;

export type SunEditorCustomType = {
   SunEditorCustomGetValue: () => string;
};

const SunEditorCustom = forwardRef<SunEditorCustomType, {}>((props, ref) => {
   const editor = useRef<SunEditorCore>();

   const [value, setValue] = useState('');

   // The sunEditor parameter will be set to the core suneditor instance when this function is called
   const getSunEditorInstance = (sunEditor: SunEditorCore) => {
      editor.current = sunEditor;
   };

   const handleChange = (content: string) => {
      setValue(content);
   };

   useImperativeHandle(ref, () => ({
      SunEditorCustomGetValue,
   }));

   const SunEditorCustomGetValue = () => value;

   const imageHandler = async (uploadBeforeHandler: UploadBeforeHandler) => {
      console.log('uploadBeforeHandler', uploadBeforeHandler);

      console.log('asdasdgasda');
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();
      input.addEventListener('change', async () => {
         //이미지를 담아 전송할 file을 만든다
         const file = input.files?.[0];
         // try {
         //    //업로드할 파일의 이름으로 Date 사용
         //    const name = Date.now();
         //    //생성한 s3 관련 설정들
         //    AWS.config.update({
         //       region: REGION,
         //       accessKeyId: ACCESS_KEY,
         //       secretAccessKey: SECRET_ACCESS_KEY,
         //    });
         //    //앞서 생성한 file을 담아 s3에 업로드하는 객체를 만든다
         //    const upload = new AWS.S3.ManagedUpload({
         //       params: {
         //          ACL: 'public-read',
         //          Bucket: 'itsmovietime', //버킷 이름
         //          Key: `upload/${name}`,
         //          Body: file,
         //       },
         //    });
         //    //이미지 업로드 후
         //    //곧바로 업로드 된 이미지 url을 가져오기
         //    const IMG_URL = await upload.promise().then((res) => res.Location);
         //    //useRef를 사용해 에디터에 접근한 후
         //    //에디터의 현재 커서 위치에 이미지 삽입

         //    const html = `<img src="${IMG_URL}" title="${name}" />`;
         //    // editor.current?.insertHTML(html);

         //    // const editor = editor
         //    // const range = editor.getSelection();
         //    // 가져온 위치에 이미지를 삽입한다
         //    // editor.insertEmbed(range!.index, 'image', IMG_URL);
         // } catch (error) {
         //    console.log(error);
         // }
      });
   };

   const handleImageUploadBefore = (files: Array<File>, info: object, uploadHandler: UploadBeforeHandler) => {
      // uploadHandler is a function
      console.log('-------------files', files);
      console.log('-------------info', info);

      const formData = new FormData();
      files.map((file, k) => {
         console.log('file', file['name']);
         formData.append(`files`, file, file['name']);
      });
      console.log('-----------------formData', formData);
      console.log('formData.values', formData.values.length);

      // const input = document.createElement('input');
      // input.setAttribute('type', 'file');
      // input.setAttribute('accept', 'image/*');
      // input.click();
      // input.addEventListener('change', async () => {
      //이미지를 담아 전송할 file을 만든다

      // try {
      //    //업로드할 파일의 이름으로 Date 사용
      //    const name = Date.now();
      //    //생성한 s3 관련 설정들
      //    AWS.config.update({
      //       region: REGION,
      //       accessKeyId: ACCESS_KEY,
      //       secretAccessKey: SECRET_ACCESS_KEY,
      //    });
      //    //앞서 생성한 file을 담아 s3에 업로드하는 객체를 만든다
      //    const upload = new AWS.S3.ManagedUpload({
      //       params: {
      //          ACL: 'public-read',
      //          Bucket: 'itsmovietime', //버킷 이름
      //          Key: `upload/${name}`,
      //          Body: formData,
      //       },
      //    });
      //    //이미지 업로드 후
      //    //곧바로 업로드 된 이미지 url을 가져오기
      //    console.log('upload', upload);
      //    const IMG_URL = upload.promise().then((res) => res.Location);
      //    //useRef를 사용해 에디터에 접근한 후
      //    //에디터의 현재 커서 위치에 이미지 삽입

      //    const html = `<img src="${IMG_URL}" title="${name}" />`;
      //    // editor.current?.insertHTML(html);

      //    // const editor = editor
      //    // const range = editor.getSelection();
      //    // 가져온 위치에 이미지를 삽입한다
      //    // editor.insertEmbed(range!.index, 'image', IMG_URL);
      // } catch (error) {
      //    console.log(error);
      // }
      // });

      async () => {
         // const { data } = await axios.post('http://localhost:1000/api/v1/upload/single', formData);
         // const res = {
         //    result: [
         //       {
         //          url: data?.url,
         //          name: 'thumbnail',
         //       },
         //    ],
         // };
         // uploadHandler(files);
      };
      return true;
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
            // setContents="aaa"
            placeholder="내용을 입력하세요"
            onChange={handleChange}
            setOptions={{
               buttonList: buttonList,
            }}
            // onImageUpload={imageHandler}

            onImageUploadBefore={handleImageUploadBefore}
         />
      </div>
   );
});

SunEditorCustom.displayName = 'SunEditor';

export default SunEditorCustom;

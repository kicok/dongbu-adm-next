import { S3Url } from '@/utils/web-initial';

// S3 이미지 업로드
export const imgFormUpload = async (formData: FormData) => {
   const response = await fetch('/api/wysiwyg-s3', {
      method: 'POST',
      body: formData,
   });

   if (response.status === 200) return await response.json();
   else '';
};

// S3 이미지 리스트
export const listObjectsV2 = async (dirName: string) => {
   if (!dirName) return;

   const formData = new FormData();
   formData.append('dirName', dirName);
   console.log('dirName', dirName);

   const response = await fetch('/api/wysiwyg-s3/listObjectsV2', {
      method: 'POST',
      body: formData,
   });

   if (response.status === 200) return await response.json();
   else '';
};

// S3 이미지 삭제
export const deleteEditorS3 = async (filePathName: string) => {
   if (!filePathName) return;

   filePathName = filePathName.replace(S3Url, '');
   //    console.log('filePathName', filePathName);

   try {
      const formData = new FormData();
      formData.append('filePathName', filePathName);

      const s3delRes = await fetch('/api/wysiwyg-s3/deleteObject', {
         method: 'POST',
         body: formData,
      });

      const result = await s3delRes.json();
      return result;
   } catch (error) {
      console.log(error);
   }
};

// s3 이미지 폴더 삭제 => 특정 폴더내의 모든 이미지리스트 삭제
// 폴더내의 다른 폴더는 고려하지 않았기 때문에 폴더내에 포함된 다른 폴더가 없다는 가정하에 개발함.
export const imageListDeleteS3 = async (imgPath: string) => {
   const result = await listObjectsV2(imgPath);
   //s3는 폴더를 삭제할수 없기 때문에 폴더내의 이미지리스트를 가져와서  모두 삭제하면 폴더도 사라진다.
   if (result.success) {
      // 폴더내의 이미지를 한개씩 개별 삭제
      result.res.map((filePathName: string) => deleteEditorS3(filePathName));
   }
};

// 저장하기 전에 이미지의 처음과 마지막 상태를 비교 체크하여 없는 이미지는 삭제한다.
export const imgDelCheck = async (value: string, imgDataArr: string[], imgPath: string) => {
   const regex = /<img[^>]+src=[\"']?([^>\"']+)/gi;

   const result = value.match(regex);

   if (result != null) {
      const nowImgArr = result?.map((imgStr) => imgStr.replace('"', '').replace('<img src=', ''));

      // console.log('resultArray', nowImgArr);

      // 추가된 이미지(그리고 기존에 저장된 이미지) 와 현재 저장될 이미지를 비교하여 없는것은 삭제
      let removeArr: string[];
      if (nowImgArr) removeArr = imgDataArr?.filter((imgStr) => !nowImgArr!.includes(imgStr));
      else removeArr = imgDataArr;
      // console.log('removeArr', removeArr);
      removeArr.map((removeImg) => deleteEditorS3(removeImg)); // 이미지 삭제
   } else {
      // 이미지 폴더 삭제 => 폴더내의 모든 이미지리스트 삭제
      imageListDeleteS3(imgPath);
   }
};

export const buttonList = [
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

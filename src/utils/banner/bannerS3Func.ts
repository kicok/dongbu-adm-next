// S3 이미지 삭제
export const deleteBannerS3 = async (fileName: string) => {
   if (!fileName || fileName.split('/').length !== 2) return;

   try {
      const formData = new FormData();
      formData.append('fileName', fileName);

      const s3delRes = await fetch('/api/banner-s3/del', {
         method: 'POST',
         body: formData,
      });

      const result = await s3delRes.json();
      return result;
   } catch (error) {
      console.log(error);
   }
};

export const bannerSplity = (str: string, gubun?: string): string[] | null => {
   gubun = gubun ?? '/';
   const result = str.split(gubun as string);
   if (result.length === 2) return result;
   return null;
};

// S3 이미지 경로이동 ==> S3 이미지 복제 + 원본 삭제
export const moveBannerS3 = async (sourceFileName: string, newFileName: string) => {
   const sArr = bannerSplity(sourceFileName);
   const nArr = bannerSplity(newFileName);

   // 경로가 다르고 파일명이 같을때만 실행
   if (sArr && nArr && sArr[0] !== nArr[0] && sArr[1] === nArr[1]) {
      try {
         const formData = new FormData();
         formData.append('sourceFileName', sourceFileName);
         formData.append('newFileName', newFileName);

         const res = await fetch('/api/banner-s3/copy', {
            method: 'POST',
            body: formData,
         });

         // const result = await res.json();
         if (res.status === 200) {
            // 이미지 경로 이동이 끝나면 원본 소스 이미지 삭제
            deleteBannerS3(sourceFileName);
         } else {
            throw new Error('파일을 이동하는데 실패했습니다.');
         }
      } catch (error) {
         console.log(error);

         throw new Error('파일을 이동하는데 실패했습니다.');
      }
   }
};

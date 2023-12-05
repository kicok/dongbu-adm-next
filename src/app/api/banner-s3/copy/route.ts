import { NextResponse } from 'next/server';
import { S3Client, CopyObjectCommand } from '@aws-sdk/client-s3';
import { S3BannerPrefix, S3BannerUrl } from '@/utils/web-initial';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const s3Client = new S3Client({
   region: process.env.AWS_S3_REGION as string,
   credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
   },
});

// 버킷간 객체 복사
// sourceFileName, newFileName 에는 각각의 디렉토리 경로 문자열이 포함되어있음.
async function copyFileToS3(sourceFileName: string, newFileName: string) {
   const params = {
      CopySource: (process.env.AWS_S3_BUCKET_NAME as string) + '/' + S3BannerPrefix + sourceFileName, // 소스 버킷
      Bucket: process.env.AWS_S3_BUCKET_NAME as string, // 목적지 버킷
      Key: S3BannerPrefix + newFileName,
   };

   const command = new CopyObjectCommand(params);

   const response = await s3Client.send(command, (error, data) => {
      if (error) {
         //  console.log('error~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', error);
      }
      //console.log('data~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', data);
   });

   return response;
}

export async function POST(request: Request) {
   const session = await getServerSession(authOptions);
   if (session) {
      try {
         const formData = await request.formData();

         const newFileName = formData.get('newFileName') as string;
         const sourceFileName = formData.get('sourceFileName') as string;

         if (!newFileName) {
            return NextResponse.json({ error: 'newFileName is required' }, { status: 400 });
         }

         const res = await copyFileToS3(sourceFileName, newFileName);

         // S3BannerUrl + newFileName;

         return NextResponse.json({ success: true, res });
      } catch (error) {
         return NextResponse.json({ error: 'Error copy file' }, { status: 400 });
      }
   } else {
      return new NextResponse(null, { status: 403 });
   }
}

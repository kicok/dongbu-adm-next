import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { S3BannerPrefix } from '@/utils/web-initial';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const s3Client = new S3Client({
   region: process.env.AWS_S3_REGION as string,
   credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
   },
});

async function uploadFileToS3(fileBuffer: Buffer, fileName: string, position: string) {
   // const index = fileName.lastIndexOf('.');
   // const replaceStr = `-${Date.now()}.`;
   // fileName = position + '/' + replaceAt(fileName, index, replaceStr);
   fileName = position + '/' + fileName;

   const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: S3BannerPrefix + fileName,
      Body: fileBuffer,
      ContentType: 'image/jpg',
   };

   try {
      const command = new PutObjectCommand(params);

      const response = await s3Client.send(command);

      return fileName;
   } catch (error) {
      console.log('error::', error);
   }
}

export async function POST(request: Request) {
   const session = await getServerSession(authOptions);
   if (session) {
      try {
         const formData = await request.formData();
         const file = formData.get('file') as File;
         const position = formData.get('position') as string;

         if (!file) {
            return NextResponse.json({ error: 'File is required' }, { status: 400 });
         }

         const buffer = Buffer.from(await file.arrayBuffer()); // 메모리 효율을 위해서 데이터를 잘게 쪼개서 전송한다.
         const fileName = await uploadFileToS3(buffer, file.name, position);

         return NextResponse.json({ success: true, fileName });
      } catch (error) {
         return NextResponse.json({ error: 'Error uploading file' }, { status: 400 });
      }
   } else {
      return new NextResponse(null, { status: 403 });
   }
}

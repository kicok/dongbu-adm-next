import { NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { S3BannerPrefix } from '@/utils/web-initial';

const s3Client = new S3Client({
   region: process.env.AWS_S3_REGION as string,
   credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
   },
});

async function deleteFileToS3(fileName: string) {
   const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: S3BannerPrefix + fileName,
   };

   try {
      const command = new DeleteObjectCommand(params);

      const response = await s3Client.send(command);

      return response;
   } catch (error) {
      console.log('error::', error);
   }
}
export async function POST(request: Request) {
   try {
      const formData = await request.formData();

      const fileName = formData.get('fileName') as string;

      if (!fileName) {
         return NextResponse.json({ error: 'fileName is required' }, { status: 400 });
      }

      const res = await deleteFileToS3(fileName);

      return NextResponse.json({ success: true, res });
   } catch (error) {
      return NextResponse.json({ error: 'Error delete file' }, { status: 400 });
   }
}

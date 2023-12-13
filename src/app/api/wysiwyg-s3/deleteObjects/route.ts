import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand, ObjectIdentifier } from '@aws-sdk/client-s3';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const s3Client = new S3Client({
   region: process.env.AWS_S3_REGION as string,
   credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
   },
});

async function imageListDelete(dirName: string) {
   const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Prefix: dirName,
      MaxKeys: 1000,
   };

   try {
      // 폴더내의 이미지를 리턴
      const command = new ListObjectsV2Command(params);
      const response = await s3Client.send(command);

      // 폴더내의 이미지가 있다면 모두 삭제
      if (response.Contents && response.Contents?.length > 0) {
         const delParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME as string,
            Delete: { Objects: response.Contents as ObjectIdentifier[], Quiet: false },
         };

         const delCommand = new DeleteObjectsCommand(delParams);

         const delRes = s3Client.send(delCommand);

         return delRes;
      }

      return;
   } catch (error) {
      console.log('error::', error);
   }
}
export async function POST(request: Request) {
   const session = await getServerSession(authOptions);
   if (session) {
      try {
         const formData = await request.formData();

         const filePathName = formData.get('filePathName') as string;

         if (!filePathName) {
            return NextResponse.json({ error: 'filePathName is required' }, { status: 400 });
         }

         const res = await imageListDelete(filePathName);

         return NextResponse.json({ success: true, res });
      } catch (error) {
         return NextResponse.json({ error: 'Error delete file' }, { status: 400 });
      }
   } else {
      return new NextResponse(null, { status: 403 });
   }
}

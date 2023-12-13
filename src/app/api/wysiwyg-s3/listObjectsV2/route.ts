import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const s3Client = new S3Client({
   region: process.env.AWS_S3_REGION as string,
   credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
   },
});

async function listObjectsS3(dirName: string) {
   const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Prefix: dirName,
      MaxKeys: 1000,
   };

   try {
      const command = new ListObjectsV2Command(params);

      // const response = await s3Client.send(command);
      // console.log('response::::', response);

      let isTruncated: boolean = true;

      let contents: (string | undefined)[] = [];

      while (isTruncated) {
         const { Contents, IsTruncated, NextContinuationToken } = await s3Client.send(command);
         let contentsList;
         if (Contents) {
            contents = Contents.map((c) => c.Key);
         }
         isTruncated = IsTruncated as boolean;
         command.input.ContinuationToken = NextContinuationToken;
      }
      // console.log('contents:::::', contents);

      return contents;
   } catch (error) {
      console.log('error::', error);
   }
}
export async function POST(request: Request) {
   const session = await getServerSession(authOptions);
   if (session) {
      try {
         const formData = await request.formData();

         const dirName = formData.get('dirName') as string;

         if (!dirName) {
            return NextResponse.json({ error: 'dirName is required' }, { status: 400 });
         }

         const res = await listObjectsS3(dirName);

         return NextResponse.json({ success: true, res });
      } catch (error) {
         return NextResponse.json({ error: 'get listObjecs error' }, { status: 400 });
      }
   } else {
      return new NextResponse(null, { status: 403 });
   }
}

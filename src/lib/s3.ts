import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export async function uploadToS3(
  file: File
): Promise<{ file_key: string; file_name: string }> {
  try {
    const s3Client = new S3Client({
      region: "eu-north-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
      },
    });

    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: file,
      ContentType: "application/pdf",
    };

    const command = new PutObjectCommand(params);
    const upload = new Upload({
      client: s3Client,
      params: command.input,
    });

    // 添加上传进度监听器
    upload.on("httpUploadProgress", (progress) => {
      console.log(
        `uploading to s3 .... Uploaded ${progress.loaded} bytes out of ${progress.total} bytes`
      );
    });

    // 执行上传操作
    await upload.done();

    return {
      file_key,
      file_name: file.name,
    };
  } catch (error) {
    throw error;
  }
}

export function getS3Url(file_key: string): string {
  return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${file_key}`;
}

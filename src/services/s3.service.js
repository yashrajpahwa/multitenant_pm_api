import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../config/env.js";

const forcePathStyle = env.S3_FORCE_PATH_STYLE.toLowerCase() === "true";

const s3 = new S3Client({
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT,
  forcePathStyle,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

export const uploadBuffer = async (params) => {
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: params.key,
    Body: params.buffer,
    ContentType: params.contentType,
  });

  await s3.send(command);

  if (env.S3_PUBLIC_URL) {
    return `${ env.S3_PUBLIC_URL}/${ params.key}`;
  }

  const endpoint = env.S3_ENDPOINT.replace(/\/$/, "");
  if (forcePathStyle) {
    return `${ endpoint}/${ env.S3_BUCKET}/${ params.key}`;
  }

  const withoutProtocol = endpoint.replace(/^https?:\/\//, "");
  return `https://${ env.S3_BUCKET}.$ {withoutProtocol}/${ params.key}`;
};

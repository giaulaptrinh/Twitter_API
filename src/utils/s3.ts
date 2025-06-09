import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
config()
const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  }
})
export const uploadFileToS3 = async ({
  filename,
  filepath,
  contenType
}: {
  filename: string
  filepath: string
  contenType: string
}) => {
  const parallelUploads3 = new Upload({
    client: s3,
    params: { Bucket: 'twitter-clone-2025', Key: filename, Body: fs.readFileSync(filepath), ContentType: contenType },
    tags: [
      /*...*/
    ],

    queueSize: 4, // (optional) concurrency configuration
    partSize: 1024 * 1024 * 5, // (optional) size of each part, in bytes, at least 5MB
    // (optional) when true, do not automatically call AbortMultipartUpload when
    // a multipart upload fails to complete. You should then manually handle
    // the leftover parts.
    leavePartsOnError: false
  })
  return parallelUploads3.done()
}

// parallelUploads3.on('httpUploadProgress', (progress) => {
//   console.log(progress)
// })

// s3.listBuckets({}).then((data) => {
//   console.log(data)
// })
// parallelUploads3.done().then((data) => {
//   console.log(data)
// })

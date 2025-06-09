import { Request } from 'express'
import { convertToFileURL, getNameFromFilename, handleUploadImage, handleUploadVideo } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import path from 'path'
import fs from 'fs-extra'
import { rimrafSync } from 'rimraf'
import fsPromise from 'fs/promises'
import { isProduction } from '~/constants/config'
import { MediaType } from '~/constants/enum'
import { Media } from '~/models/Other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import { uploadFileToS3 } from '~/utils/s3'
import mime from 'mime'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'
class Queue {
  items: string[]
  encoding: boolean
  constructor() {
    this.items = []
    this.encoding = false
  }
  enqueue(item: string) {
    this.items.push(item)
    this.processEncode()
  }
  async processEncode() {
    if (this.encoding) return

    if (this.items.length > 0) {
      this.encoding = true
      const videoPath = this.items[0]
      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        this.items.shift()
        await fsPromise.unlink(videoPath)
        console.log(`Encode video ${videoPath} success`)
      } catch (error) {
        console.log(`Encode video ${videoPath} error`)
        console.log(error)
      }
      this.encoding = false
      this.processEncode()
    } else {
      console.log('Encode video queue is empty')
    }
  }
}
const queue = new Queue()
class MediasServices {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFilename(file.newFilename)
        const newFullFileName = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullFileName)
        await sharp(file.filepath).jpeg({ quality: 80 }).toFile(newPath)
        await sharp(file.filepath).destroy()

        const s3Result = await uploadFileToS3({
          filename: 'images/' + newFullFileName,
          filepath: newPath,
          contenType: mime.getType(newPath) as string
        })
        // Xóa file png trong file tam chi luu trong file goc
        // Neu upload file jpg thi khong can xoa file tam
        // await Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newPath)]
        rimrafSync(file.filepath)
        // return {
        //   url: isProduction
        //     ? `${process.env.HOST}/static/image/${newFullFileName}`
        //     : `http://localhost:4000/static/image/${newFullFileName}`,
        //   type: MediaType.Image
        // }
        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Image
        }
      })
    )
    return result
  }

  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = files.map((file) => {
      return {
        url: isProduction
          ? `${process.env.HOST}/static/video/${file.newFilename}.`
          : `http://localhost:${process.env.PORT}/static/video/${file.newFilename}.`,
        type: MediaType.Video
      }
    })
    return result
  }
  async uploadVideoHLS(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const inputVideoPath = 'D:\\dulieu\\NodeJs-Super\\Twitter\\uploads\\videos\\example.mp4'
        await encodeHLSWithMultipleVideoStreams(inputVideoPath)
        const newName = getNameFromFilename(file.newFilename)
        // queue.enqueue(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/video-hls/${newName}.m3u8`
            : `http://localhost:${process.env.PORT}/static/video-hls/${newName}.m3u8`,
          type: MediaType.HLS
        }
      })
    )
    return result
  }
}

const mediasServices = new MediasServices()
export default mediasServices

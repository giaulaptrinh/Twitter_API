import formidable, { File } from 'formidable'
import fs from 'fs'
import path from 'path'
import { Request } from 'express'
import { UPLOAD_IMAGE_DIR, UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'

export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true // mục đích là tạo folder nested
      })
    }
  })
}
export const handleUploadImage = (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 4,
    keepExtensions: true,
    maxFieldsSize: 300 * 1024, //300KB
    maxTotalFileSize: 300 * 1024 * 4,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        reject(new Error('File is empty'))
      }
      resolve(files.image as File[])
    })
  })
}
//Cách 1: Tạo unique id cho video ngay từ đầu
// Cách 2 :Đợi video upload xong rồi tạo folder,move video vào

//Cách xử lý khi upload video và encode
//Có 2 giai đoạn
//1. Upload video :Upload video thành công thì resolove về cho người dùng
//2. Encode video :Khai báo thêm 1 url endpoint để check xem cái video đó encode xong chưa
export const handleUploadVideo = (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_DIR,
    maxFiles: 1,
    maxFieldsSize: 50 * 1024 * 1024, //50MB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        reject(new Error('File is empty'))
      }
      const videos = files.video as File[]
      videos.forEach((video) => {
        const ext = getExtension(video.originalFilename as string)
        fs.renameSync(video.filepath, video.filepath + '.' + ext)
        video.newFilename = video.newFilename + '.' + ext
        video.filepath = video.filepath + '.' + ext
      })
      resolve(files.video as File[])
    })
  })
}
export const getNameFromFilename = (fullname: string) => {
  const namerr = fullname.split('.')
  namerr.pop()
  return namerr.join('')
}
export const getExtension = (fullname: string) => {
  const namerr = fullname.split('.')
  return namerr[namerr.length - 1]
}

const convertToFileURL = (filePath: string): string => {
  const resolvedPath = path.resolve(filePath).replace(/\\/g, '/') // Chuyển đổi \\ thành /
  return encodeURI(`file:///${resolvedPath}`)
}

export { convertToFileURL }

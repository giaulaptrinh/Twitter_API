import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import mediasServices from '~/services/medias.services'
import mime from 'mime-types'
export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasServices.uploadImage(req)
  res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: result
  })
}
export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasServices.uploadVideo(req)
  res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: result
  })
}
export const uploadVideoHLSController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasServices.uploadVideoHLS(req)
  res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: result
  })
}
export const serveImageController = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send('NOT FOUND')
    }
  })
}
export const serveVideoStreamController = async (req: Request, res: Response, next: NextFunction) => {
  const range = req.headers.range as string
  if (!range) {
    res.status(HTTP_STATUS.BAD_REQUEST).send('Requires Range header')
  }
  const { name } = req.params
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name)
  //1MB =10^6 bytes(Tính theo hệ 10, đây là thứ chúng ta hay thấy trên UI)
  // Còn nếu tính theo hệ nhị phân thì 1MB = 2^20 bytes(1024*1024)

  // Dung lượng video(bytes)
  const videoSize = fs.statSync(videoPath).size
  // Dung luợn video cho mỗi phân đoạn stream
  const chunkSize = 30 * 10 ** 6 // 30MB
  // Lấy giá trị byte bắt đầu từ header Range(vd:bytes=1048576)
  const start = Number(range.replace(/\D/g, ''))
  // Lấy giá trị byte kết thúc ,vượt quá dung lượng video thì lấy giá trị videoSize
  const end = Math.min(start + chunkSize, videoSize - 1)
  // Dung lượng thực tế cho mỗi đoạn video stream
  //Thường đầy là chunkSIze nhưng ở đoạn cuối có thể nhỏ hơn chunkSize
  const contentLength = end - start + 1
  const contentType = mime.lookup(videoPath) || 'video/*'
  const headers = {
    'Content-Range': `bytes ${start}-${end - 1}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
  const videoStreams = fs.createReadStream(videoPath, { start, end })
  videoStreams.pipe(res)
}

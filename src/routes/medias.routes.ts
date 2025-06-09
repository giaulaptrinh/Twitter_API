import { Router } from 'express'
import {
  uploadImageController,
  uploadVideoController,
  uploadVideoHLSController
} from '~/controllers/medias.controllers'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const mediasRouter = Router()
mediasRouter.post('/upload-image', accessTokenValidator, verifyUserValidator, wrapRequestHandler(uploadImageController))

mediasRouter.post('/upload-video', accessTokenValidator, verifyUserValidator, wrapRequestHandler(uploadVideoController))
mediasRouter.post(
  '/upload-video-hls',
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(uploadVideoHLSController)
)
export default mediasRouter

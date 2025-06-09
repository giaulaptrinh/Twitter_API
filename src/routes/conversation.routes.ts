import { Router } from 'express'
import { getConversationsController } from '~/controllers/conversation.controllers'
import { accessTokenValidator, getConversationsValidator, verifyUserValidator } from '~/middlewares/users.middlewares'

const conversationRouter = Router()

conversationRouter.get(
  '/receivers/:receiver_id',
  accessTokenValidator,
  verifyUserValidator,
  getConversationsValidator,
  getConversationsController
)

export default conversationRouter

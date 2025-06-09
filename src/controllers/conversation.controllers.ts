import { Request, Response } from 'express'
import { getConversationsParams } from '~/models/requests/Conversation.requests'
import conversationsService from '~/services/conversations.services'

export const getConversationsController = async (req: Request<getConversationsParams>, res: Response) => {
  const sender_id = req.decoded_authorization?.user_id as string
  const { receiver_id } = req.params
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  console.log('Controller received:', {
    sender_id: sender_id,
    receiver_id: req.params.receiver_id
  })
  const result = await conversationsService.getConversations({ sender_id, receiver_id, limit, page })
  res.json({
    message: 'Get conversations successfully',
    result: {
      conversations: result.conversations,
      limit: limit,
      page: page,
      total_page: Math.ceil(result.total / limit) || 1
    }
  })
}

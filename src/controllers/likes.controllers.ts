import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/User.requests'
import { LIKE_MESSAGES } from '~/constants/messages'
import { LikeReqBody } from '~/models/requests/Like.requests'
import likesService from '~/services/likes.services'

export const likeTweetController = async (req: Request<ParamsDictionary, any, LikeReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likesService.likeTweet(user_id, req.body.tweet_id)
  res.json({
    message: LIKE_MESSAGES.LIKE_SUCCESSFULLY,
    result
  })
}
export const unlikeTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  await likesService.unlikeTweet(user_id, req.params.tweet_id)
  res.json({
    message: LIKE_MESSAGES.UNLIKE_SUCCESSFULLY
  })
}

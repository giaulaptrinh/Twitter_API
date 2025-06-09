import { Router } from 'express'
import { bookmarkTweetController, unbookmarkTweetController } from '~/controllers/bookmarks.controllers'
import { likeTweetController, unlikeTweetController } from '~/controllers/likes.controllers'
import { tweetIdValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const likesRouter = Router()

/**
 * Description :Like Tweet
 * Path:/likes
 * Method :POST
 * Body:{tweet_id:string}
 * Header :{Authorization:Bearer<access_token>}
 */
likesRouter.post(
  '/',
  accessTokenValidator,
  verifyUserValidator,
  tweetIdValidator,
  wrapRequestHandler(likeTweetController)
)
/**
 * Description :UnLike Tweet
 * Path:/likes/:tweet_id
 * Method :DELETE
 * Header :{Authorization:Bearer<access_token>}
 */
likesRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(unlikeTweetController)
)

export default likesRouter

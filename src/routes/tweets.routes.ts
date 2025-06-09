import { Router } from 'express'
import {
  createTweetController,
  getNewFeedsController,
  getTweetChildrenController,
  getTweetController
} from '~/controllers/tweets.controllers'
import {
  audienceValidator,
  createTweetValidator,
  getTweetChildrenValidator,
  paginationValidator,
  tweetIdValidator
} from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, isUserLoggedInValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const tweetsRouter = Router()

/**
 * Description :Create a new tweet
 * Path:/
 * Method :POST
 * Body:TweetRequestBody
 */
tweetsRouter.post(
  '/',
  accessTokenValidator,
  verifyUserValidator,
  createTweetValidator,
  wrapRequestHandler(createTweetController)
)
/**
 * Description :Get Tweet detail
 * Path:/:tweet_id
 * Method :GET
 * Header:{Authorization?:Bearer token<accessToken>}
 */
tweetsRouter.get(
  '/:tweet_id',
  tweetIdValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifyUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetController)
)
/**
 * Description :Get Tweet Children
 * Path:/:tweet_id/chilren
 * Method :GET
 * Header:{Authorization?:Bearer token<accessToken>}
 * Query:{limit:number,page:number,tweet_type:TweetType}
 */
tweetsRouter.get(
  '/:tweet_id/children',
  tweetIdValidator,
  getTweetChildrenValidator,
  paginationValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifyUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetChildrenController)
)
/**
 * Description :Get new feeds
 * Path:/
 * Method :GET
 * Header:{Authorization?:Bearer token<accessToken>}
 * Query:{limit:number,page:number}
 */
tweetsRouter.get(
  '/',
  paginationValidator,
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(getNewFeedsController)
)
export default tweetsRouter

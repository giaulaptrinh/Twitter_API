// import { Router } from 'express'
// import { bookmarkTweetController, unbookmarkTweetController } from '~/controllers/bookmarks.controllers'
// import { likeTweetController, unlikeTweetController } from '~/controllers/likes.controllers'
// import { tweetIdValidator } from '~/middlewares/tweets.middlewares'
// import { accessTokenValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
// import { wrapRequestHandler } from '~/utils/handlers'

// const likesRouter = Router()

// /**
//  * Description :Like Tweet
//  * Path:/likes
//  * Method :POST
//  * Body:{tweet_id:string}
//  * Header :{Authorization:Bearer<access_token>}
//  */
// likesRouter.post(
//   '/',
//   accessTokenValidator,
//   verifyUserValidator,
//   tweetIdValidator,
//   wrapRequestHandler(likeTweetController)
// )
// /**
//  * Description :UnLike Tweet
//  * Path:/likes/:tweet_id
//  * Method :DELETE
//  * Header :{Authorization:Bearer<access_token>}
//  */
// likesRouter.delete(
//   '/tweets/:tweet_id',
//   accessTokenValidator,
//   verifyUserValidator,
//   wrapRequestHandler(unlikeTweetController)
// )

// export default likesRouter
import { Router } from 'express'
import { likeTweetController, unlikeTweetController } from '~/controllers/likes.controllers'
import { tweetIdValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const likesRouter = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     LikeRequestBody:
 *       type: object
 *       required:
 *         - tweet_id
 *       properties:
 *         tweet_id:
 *           type: string
 *           format: MongoId
 *           description: Tweet ID
 *           example: 64be0ad2e43d2464394feedb
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Operation successful
 *         result:
 *           type: object
 *           additionalProperties: true
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: An error occurred
 *         code:
 *           type: string
 *           example: ERROR_CODE
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /likes:
 *   post:
 *     summary: Like a Tweet
 *     description: Like a specific tweet.
 *     operationId: likeTweet
 *     tags:
 *       - likes
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Tweet ID to like
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LikeRequestBody'
 *     responses:
 *       '200':
 *         description: Tweet liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Like tweet successfully
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
likesRouter.post(
  '/',
  accessTokenValidator,
  verifyUserValidator,
  tweetIdValidator,
  wrapRequestHandler(likeTweetController)
)

/**
 * @swagger
 * /likes/{tweet_id}:
 *   delete:
 *     summary: Unlike a Tweet
 *     description: Remove a like from a specific tweet by tweet ID.
 *     operationId: unlikeTweetByTweetId
 *     tags:
 *       - likes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: tweet_id
 *         in: path
 *         description: ID of the tweet to unlike
 *         required: true
 *         schema:
 *           type: string
 *           format: MongoId
 *           example: 64be0ad2e43d2464394feedb
 *     responses:
 *       '200':
 *         description: Tweet unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unlike tweet successfully
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
likesRouter.delete('/:tweet_id', accessTokenValidator, verifyUserValidator, wrapRequestHandler(unlikeTweetController))

export default likesRouter

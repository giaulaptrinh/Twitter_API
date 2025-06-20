// import { Router } from 'express'
// import { bookmarkTweetController, unbookmarkTweetController } from '~/controllers/bookmarks.controllers'
// import { tweetIdValidator } from '~/middlewares/tweets.middlewares'
// import { accessTokenValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
// import { wrapRequestHandler } from '~/utils/handlers'

// const bookmarksRouter = Router()

// /**
//  * Description :Bookmark Tweet
//  * Path:/bookmarks
//  * Method :POST
//  * Body:{tweet_id:string}
//  * Header :{Authorization:Bearer<access_token>}
//  */
// bookmarksRouter.post(
//   '/',
//   accessTokenValidator,
//   verifyUserValidator,
//   tweetIdValidator,
//   wrapRequestHandler(bookmarkTweetController)
// )

// /**
//  * Description :Unbookmark Tweet
//  * Path:/tweets/:tweet_id
//  * Method :DELETE
//  * Header :{Authorization:Bearer<access_token>}
//  */
// bookmarksRouter.delete(
//   '/tweets/:tweet_id',
//   accessTokenValidator,
//   verifyUserValidator,
//   wrapRequestHandler(unbookmarkTweetController)
// )
// export default bookmarksRouter
import { Router } from 'express'
import { bookmarkTweetController, unbookmarkTweetController } from '~/controllers/bookmarks.controllers'
import { tweetIdValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const bookmarksRouter = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     BookmarkRequestBody:
 *       type: object
 *       required:
 *         - tweet_id
 *       properties:
 *         tweet_id:
 *           type: string
 *           format: MongoId
 *           description: Tweet ID
 *           example: 6781301ffa05ad6f36a8055c
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
 * /bookmarks:
 *   post:
 *     summary: Bookmark a Tweet
 *     description: Bookmark a specific tweet.
 *     operationId: bookmarkTweet
 *     tags:
 *       - bookmarks
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Tweet ID to bookmark
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookmarkRequestBody'
 *     responses:
 *       '200':
 *         description: Tweet bookmarked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bookmark tweet successfully
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
bookmarksRouter.post(
  '/',
  accessTokenValidator,
  verifyUserValidator,
  tweetIdValidator,
  wrapRequestHandler(bookmarkTweetController)
)

/**
 * @swagger
 * /bookmarks/tweets/{tweet_id}:
 *   delete:
 *     summary: Unbookmark a Tweet
 *     description: Remove a bookmark from a specific tweet by tweet ID.
 *     operationId: unbookmarkTweetByTweetId
 *     tags:
 *       - bookmarks
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: tweet_id
 *         in: path
 *         description: ID of the tweet to unbookmark
 *         required: true
 *         schema:
 *           type: string
 *           format: MongoId
 *           example: 6781301ffa05ad6f36a8055c
 *     responses:
 *       '200':
 *         description: Tweet unbookmarked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unbookmark tweet successfully
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
bookmarksRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(unbookmarkTweetController)
)

export default bookmarksRouter

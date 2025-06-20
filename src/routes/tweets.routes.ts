// import { Router } from 'express'
// import {
//   createTweetController,
//   getNewFeedsController,
//   getTweetChildrenController,
//   getTweetController
// } from '~/controllers/tweets.controllers'
// import {
//   audienceValidator,
//   createTweetValidator,
//   getTweetChildrenValidator,
//   paginationValidator,
//   tweetIdValidator
// } from '~/middlewares/tweets.middlewares'
// import { accessTokenValidator, isUserLoggedInValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
// import { wrapRequestHandler } from '~/utils/handlers'

// const tweetsRouter = Router()

// /**
//  * Description :Create a new tweet
//  * Path:/
//  * Method :POST
//  * Body:TweetRequestBody
//  */
// tweetsRouter.post(
//   '/',
//   accessTokenValidator,
//   verifyUserValidator,
//   createTweetValidator,
//   wrapRequestHandler(createTweetController)
// )
// /**
//  * Description :Get Tweet detail
//  * Path:/:tweet_id
//  * Method :GET
//  * Header:{Authorization?:Bearer token<accessToken>}
//  */
// tweetsRouter.get(
//   '/:tweet_id',
//   tweetIdValidator,
//   isUserLoggedInValidator(accessTokenValidator),
//   isUserLoggedInValidator(verifyUserValidator),
//   audienceValidator,
//   wrapRequestHandler(getTweetController)
// )
// /**
//  * Description :Get Tweet Children
//  * Path:/:tweet_id/chilren
//  * Method :GET
//  * Header:{Authorization?:Bearer token<accessToken>}
//  * Query:{limit:number,page:number,tweet_type:TweetType}
//  */
// tweetsRouter.get(
//   '/:tweet_id/children',
//   tweetIdValidator,
//   getTweetChildrenValidator,
//   paginationValidator,
//   isUserLoggedInValidator(accessTokenValidator),
//   isUserLoggedInValidator(verifyUserValidator),
//   audienceValidator,
//   wrapRequestHandler(getTweetChildrenController)
// )
// /**
//  * Description :Get new feeds
//  * Path:/
//  * Method :GET
//  * Header:{Authorization?:Bearer token<accessToken>}
//  * Query:{limit:number,page:number}
//  */
// tweetsRouter.get(
//   '/',
//   paginationValidator,
//   accessTokenValidator,
//   verifyUserValidator,
//   wrapRequestHandler(getNewFeedsController)
// )
// export default tweetsRouter
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
 * @swagger
 * components:
 *   schemas:
 *     TweetRequestBody:
 *       type: object
 *       required:
 *         - type
 *         - audience
 *         - content
 *       properties:
 *         type:
 *           $ref: '#/components/schemas/TweetType'
 *         audience:
 *           $ref: '#/components/schemas/TweetAudience'
 *         content:
 *           type: string
 *           description: Tweet content
 *           example: This is my tweet.
 *         parent_id:
 *           type: string
 *           nullable: true
 *           description: ID of the parent tweet
 *           example: 64be0ad2e43d2464394feedb
 *         hashtags:
 *           type: array
 *           items:
 *             type: string
 *           description: List of hashtags
 *           example: ['hashtag1', 'hashtag2']
 *         mentions:
 *           type: array
 *           items:
 *             type: string
 *             format: MongoId
 *           description: List of mentioned user IDs
 *           example: ['64be0ad2e43d2464394feedb', '64be0ad2e43d2464394feedc']
 *         medias:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Media'
 *           description: List of attached media
 *     TweetType:
 *       type: number
 *       enum: [0, 1, 2, 3]
 *       example: 0
 *     TweetAudience:
 *       type: number
 *       enum: [0, 1]
 *       example: 0
 *     Media:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           example: http://localhost:8000/images/avatars/johndoe.jpg
 *         type:
 *           $ref: '#/components/schemas/MediaType'
 *     MediaType:
 *       type: number
 *       enum: [0, 1, 2]
 *       example: 0
 *     Tweet:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: MongoId
 *           description: Tweet ID
 *           example: 64be0ad2e43d2464394feedb
 *         user_id:
 *           type: string
 *           format: MongoId
 *           description: ID of the user who created the tweet
 *           example: 64be0ad2e43d2464394feedb
 *         type:
 *           $ref: '#/components/schemas/TweetType'
 *         audience:
 *           $ref: '#/components/schemas/TweetAudience'
 *         content:
 *           type: string
 *           description: Tweet content
 *           example: This is my tweet.
 *         parent_id:
 *           type: string
 *           nullable: true
 *           format: MongoId
 *           description: ID of the parent tweet
 *           example: 64be0ad2e43d2464394feedb
 *         hashtags:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 format: MongoId
 *                 description: Hashtag ID
 *                 example: 64be0ad2e43d2464394feedb
 *               name:
 *                 type: string
 *                 description: Hashtag name
 *                 example: hashtag1
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 description: Hashtag creation time
 *                 example: 2023-03-08T12:00:00Z
 *           description: List of hashtags
 *           example:
 *             - _id: 64be0ad2e43d2464394feedb
 *               name: hashtag1
 *               created_at: 2023-03-08T12:00:00Z
 *             - _id: 64be0ad2e43d2464394feedc
 *               name: hashtag2
 *               created_at: 2023-03-08T12:00:00Z
 *         mentions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 format: MongoId
 *                 description: ID of mentioned user
 *                 example: 64be0ad2e43d2464394feedb
 *               name:
 *                 type: string
 *                 description: Name of mentioned user
 *                 example: John Doe
 *               username:
 *                 type: string
 *                 description: Username of mentioned user
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 description: Email of mentioned user
 *                 example: duthanhduoc@gmail.com
 *           description: List of mentioned users
 *         medias:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Media'
 *           description: List of attached media
 *           example:
 *             - url: http://localhost:8000/images/avatars/johndoe.jpg
 *               type: 0
 *             - url: http://localhost:8000/images/avatars/johndoe.jpg
 *               type: 1
 *         retweet_count:
 *           type: integer
 *           description: Number of retweets
 *           example: 10
 *         comment_count:
 *           type: integer
 *           description: Number of comments
 *           example: 5
 *         quote_count:
 *           type: integer
 *           description: Number of quote tweets
 *           example: 2
 *         bookmarks:
 *           type: integer
 *           description: Number of bookmarks
 *           example: 15
 *         likes:
 *           type: integer
 *           description: Number of likes
 *           example: 20
 *         guest_views:
 *           type: integer
 *           description: Number of guest views
 *           example: 100
 *         user_views:
 *           type: integer
 *           description: Number of user views
 *           example: 50
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Tweet creation time
 *           example: 2023-03-08T12:00:00Z
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Tweet update time
 *           example: 2023-03-08T12:00:00Z
 *     TweetListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Get tweet list successfully
 *         result:
 *           type: object
 *           properties:
 *             tweets:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tweet'
 *             total_page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 *             page:
 *               type: integer
 *               example: 1
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
 * /tweets:
 *   post:
 *     summary: Create a Tweet
 *     description: Create a new tweet.
 *     operationId: createTweet
 *     tags:
 *       - tweets
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Tweet details
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TweetRequestBody'
 *     responses:
 *       '200':
 *         description: Tweet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tweet created successfully
 *                 result:
 *                   $ref: '#/components/schemas/Tweet'
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
tweetsRouter.post(
  '/',
  accessTokenValidator,
  verifyUserValidator,
  createTweetValidator,
  wrapRequestHandler(createTweetController)
)

/**
 * @swagger
 * /tweets/{tweet_id}:
 *   get:
 *     summary: Get Tweet Details
 *     description: Retrieve details of a specific tweet by ID.
 *     operationId: getTweetById
 *     tags:
 *       - tweets
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: tweet_id
 *         in: path
 *         description: ID of the tweet
 *         required: true
 *         schema:
 *           type: string
 *           format: MongoId
 *           example: 64be0ad2e43d2464394feedb
 *     responses:
 *       '200':
 *         description: Tweet retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get tweet successfully
 *                 result:
 *                   $ref: '#/components/schemas/Tweet'
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 * @swagger
 * /tweets/{tweet_id}/children:
 *   get:
 *     summary: Get Tweet Children
 *     description: Retrieve child tweets (comments, retweets, etc.) of a specific tweet.
 *     operationId: getTweetChildrenById
 *     tags:
 *       - tweets
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: tweet_id
 *         in: path
 *         description: ID of the parent tweet
 *         required: true
 *         schema:
 *           type: string
 *           format: MongoId
 *           example: 6781301ffa05ad6f36a8055c
 *       - name: limit
 *         in: query
 *         description: Number of tweets per page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: page
 *         in: query
 *         description: Page number
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: tweet_type
 *         in: query
 *         description: Type of child tweets
 *         required: false
 *         schema:
 *           $ref: '#/components/schemas/TweetType'
 *     responses:
 *       '200':
 *         description: Child tweets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TweetListResponse'
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 * @swagger
 * /tweets:
 *   get:
 *     summary: Get New Feeds
 *     description: Retrieve new tweets from followed users.
 *     operationId: getTweets
 *     tags:
 *       - tweets
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of tweets per page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: page
 *         in: query
 *         description: Page number
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: New feeds retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TweetListResponse'
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
tweetsRouter.get(
  '/',
  paginationValidator,
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(getNewFeedsController)
)

export default tweetsRouter

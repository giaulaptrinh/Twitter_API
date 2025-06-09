import { Request, NextFunction, Response } from 'express'
import { Pagination, TweetParam, TweetQuery, TweetRequestBody } from '~/models/requests/Tweet.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import tweetService from '~/services/tweet.services'
import { TokenPayload } from '~/models/requests/User.requests'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { TweetType } from '~/constants/enum'

export const createTweetController = async (req: Request<ParamsDictionary, any, TweetRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetService.createTweet(user_id, req.body)
  res.json({
    message: TWEETS_MESSAGES.CREATE_TWEET_SUCCESSFULLY,
    result
  })
}
export const getTweetController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const result = await tweetService.increaseView(req.params.tweet_id, req.decoded_authorization?.user_id)
  const tweet = {
    ...req.tweet,
    guest_views: result?.guest_views,
    user_views: result?.user_views,
    updated_at: result?.updated_at
  }
  res.json({
    message: TWEETS_MESSAGES.GET_TWEET_SUCCESSFULLY,
    result: tweet
  })
}
export const getTweetChildrenController = async (req: Request<TweetParam, any, any, TweetQuery>, res: Response) => {
  const tweet_type = Number(req.query.tweet_type as string) as TweetType
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const user_id = req.decoded_authorization?.user_id
  const { total, tweets } = await tweetService.getTweetChildren({
    tweet_id: req.params.tweet_id,
    tweet_type,
    limit,
    page,
    user_id
  })
  res.json({
    message: 'Get tweet children successfully',
    result: {
      tweets,
      tweet_type,
      limit,
      page,
      total_pages: Math.ceil(total / limit)
    }
  })
}
export const getNewFeedsController = async (req: Request<ParamsDictionary, any, any, Pagination>, res: Response) => {
  const user_id = req.decoded_authorization?.user_id as string
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)

  const result = await tweetService.getNewFeeds({ user_id, limit, page })
  res.json({
    message: 'Get New Feeds Successfully',
    result: {
      tweets: result.tweets,
      limit,
      page,
      total_pages: Math.ceil(result.total / limit)
    }
  })
}

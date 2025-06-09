import { ObjectId } from 'mongodb'

import { ParamsDictionary } from 'express-serve-static-core'

export interface getConversationsParams extends ParamsDictionary {
  receiver_id: string
}

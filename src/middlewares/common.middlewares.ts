import { NextFunction, Request, Response } from 'express'
import { pick } from 'lodash'

type FilterKeys<T> = Array<keyof T>

// loc data body
export const filterMiddleware =
  <T>(filterKeys: FilterKeys<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filterKeys)
    next()
  }

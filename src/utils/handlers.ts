// // import { Request, Response, NextFunction, RequestHandler } from 'express'
// // export const wrapRequestHandler = <P>(func: RequestHandler<P, any, any, any>) => {
// //   return async (req: Request<P>, res: Response, next: NextFunction) => {
// //     // Promise.resolve(func(req, res, next)).catch(next)
// //     try {
// //       await func(req, res, next)
// //     } catch (error) {
// //       next(error)
// //     }
// //   }
// // }

// import { Request, Response, NextFunction, RequestHandler } from 'express'

// export const wrapRequestHandler = <P>(func: RequestHandler<P, any, any, any>) => {
//   return async (req: Request<P>, res: Response, next: NextFunction) => {
//     // Sử dụng Promise.resolve để đảm bảo rằng bất kỳ async function nào cũng được xử lý đúng
//     Promise.resolve(func(req, res, next)).catch(next) // Chuyển tiếp lỗi nếu có bất kỳ ngoại lệ nào
//   }
// }
import { NextFunction, Request, RequestHandler, Response } from 'express'

export const wrapRequestHandler = <P>(func: RequestHandler<P, any, any, any>) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

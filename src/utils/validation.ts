import { validationResult, ValidationChain } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import { EntityError, ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
// Định nghĩa kiểu tùy chỉnh để đảm bảo mỗi phần tử trong mảng có phương thức run
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //nếu mà dùng validations: ValidationChain[] thì phải dùng for duyệt trong mảng validations
    for (const validation of validations) {
      await validation.run(req)
    }
    // nếu dùng validation:RunnableValidationChain<Validation> thì k cần duyệt
    // await validations.run(req)
    // Trả về tất cả các lỗi
    const errors = validationResult(req)
    //Không có lỗi thì tiếp tục request
    if (errors.isEmpty()) {
      return next()
    }
    const errorsObject = errors.mapped()
    const entityError = new EntityError({ errors: errorsObject })
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]

      ///Trả về lỗi không phải là lỗi do validatre
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      entityError.errors[key] = errorsObject[key]
    }
    console.log(errorsObject)
    // Nếu không có lỗi, tiếp tục xử lý
    next(entityError)
  }
}

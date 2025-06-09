import jwt, { SignOptions } from 'jsonwebtoken'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.requests'

export const signToken = ({
  payload,
  privateKey,
  options = {
    algorithm: 'HS256'
  } as SignOptions // Chuyển đối tượng mặc định thành kiểu SignOptions
}: {
  payload: string | Buffer | object
  privateKey: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        reject(error) // No need to throw, just reject the promise
        return
      }
      resolve(token as string)
    })
  })
}
export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      resolve(decoded as TokenPayload)
    })
  })
}

import exp from 'constants'
import { JwtPayload } from 'jsonwebtoken'
// export type TokenType = 'access' | 'refresh'
import { TokenType, UserVerifyStatus } from '~/constants/enum'

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginBody:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: levangiau20032020@gmail.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: Levangiau@123
 *
 *     SuccessAuthentication:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         refresh_token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: MongoId
 *           example: '67b98f96d4f9885b21206b67'
 *         name:
 *           type: string
 *           example: 'Lê Văn Giàu'
 *         email:
 *           type: string
 *           format: email
 *           example: 'levangiau@gmail.com'
 *         date_of_birth:
 *           type: string
 *           format: date-time
 *           example: '2024-12-02T08:23:45.000Z'
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: '2025-02-22T08:49:26.909Z'
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: '2025-02-22T08:49:26.909Z'
 *         verify:
 *           $ref: '#/components/schemas/UserVerifyStatus'
 *         twitter_circle:
 *           type: array
 *           items:
 *             type: string
 *             format: MongoId
 *           example:
 *             - '67b98f96d4f9885b21206b67'
 *             - '67a9d9bb60bdc0fc43206e1f'
 *         bio:
 *           type: string
 *           example: 'This is my bio'
 *         location:
 *           type: string
 *           example: 'Hanoi, Vietnam'
 *         website:
 *           type: string
 *           example: 'www.levangiau.com'
 *         username:
 *           type: string
 *           example: 'user67b98f96d4f9885b21206b67'
 *         avatar:
 *           type: string
 *           example: ''
 *         cover_photo:
 *           type: string
 *           example: 'https://www.levangiau.com/images/avatars/cover-photo.jpg'
 *
 *     UserVerifyStatus:
 *       type: integer
 *       enum:
 *         - 0 # Unverified
 *         - 1 # Verified
 *         - 2 # Banned
 *       example: 1

 */

export interface UpdateMeReqBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
  verify?: UserVerifyStatus
}
export interface FollowReqBody {
  followed_user_id: string
}

export interface LoginReqBody {
  email: string
  password: string
}
export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}
export interface LogoutReqBody {
  refresh_token: string
}
export interface RefeshTokenReqBody {
  refresh_token: string
}
export interface ForgotPasswordReqBody {
  email: string
}
export interface VerifyForgotPasswordReqBody {
  forgot_password_token: string
}
export interface ResetPasswordReqBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}
export interface VerifyEmailReqBody {
  email_verify_token: string
}
export interface ChangePasswordReqBody {
  old_password: string
  password: string
  confirm_password: string
}
export interface GetProfileReqParams {
  username: string
}
export interface UnFollowReqParams {
  user_id: string
}
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
  exp: number
  iat: number
}

import { Router } from 'express'
import {
  emailVerifyController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  forgotPasswordController,
  verifyForgotPasswordController,
  resetPasswordController,
  getMeController,
  updateMeController,
  getProfileController,
  followController,
  unFollowController,
  changePasswordController,
  oauthController,
  refreshTokenController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPassswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unFollowValidator,
  updateMeValidator,
  verifyForgotPasswordTokenValidator,
  verifyUserValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.requests'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()
/**
 * @swagger
 * components:
 *   schemas:
 *     LoginBody:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: hmt1@gmail.com
 *         password:
 *           type: string
 *           example: '@Aa1234567'
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
 *           example: 64be0ad2e43d2464394feedb
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         date_of_birth:
 *           type: string
 *           format: date-time
 *           example: 2023-06-08T10:17:31.096Z
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: 2023-03-08T12:00:00Z
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: 2023-03-08T12:00:00Z
 *         verify:
 *           $ref: '#/components/schemas/UserVerifyStatus'
 *         twitter_circle:
 *           type: array
 *           items:
 *             type: string
 *             format: MongoId
 *           example: ['64be0ad2e43d2464394feedb', '64be0ad2e43d2464394feedc']
 *         bio:
 *           type: string
 *           example: 'This is my bio.'
 *         location:
 *           type: string
 *           example: 'San Francisco, CA'
 *         website:
 *           type: string
 *           example: 'www.example.com'
 *         username:
 *           type: string
 *           example: 'johndoe'
 *         avatar:
 *           type: string
 *           example: 'http:localhost:4000/images/avatars/johndoe.jpg'
 *         cover_photo:
 *           type: string
 *           example: 'http:localhost:4000/images/avatars/johndoe.jpg'
 *
 *     UserVerifyStatus:
 *       type: number
 *       enum: [Unverified, Verified, Banned]
 *       example: 1
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User Login
 *     description: Authenticate a user and return access and refresh tokens.
 *     operationId: login
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       description: User login credentials
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginBody'
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login success
 *                 result:
 *                   $ref: '#/components/schemas/SuccessAuthentication'
 *       '422':
 *         description: Invalid input
 */

usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
/**
 * Description :OAuth with google
 * Path:/oauth/google
 * Method :GET
 * Query:{code:string}
 */
usersRouter.get('/oauth/google', wrapRequestHandler(oauthController))

/**
 * Description :Register a new user
 * Path:/register
 * Method :POST
 * Body:{name:string,email:string,password:string,date_of_birth:ISO8601}
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
/**
 * Description :Logout a new user
 * Path:/logout
 * Method :POST
 * Headers:{Authorization:Bearer <access_token>}
 * Body:{refresh_token:string}
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
/**
 * Description :Refresh Token
 * Path:/refresh-token
 * Method :POST
 * Body:{refresh_token:string}
 */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * Description :Verify email when user click on the link in email
 * Path:/verify-email
 * Method :POST
 * Body:{email_verify_token:string}
 */

usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(emailVerifyController))
/**
 * Description :Verify email when user click on the link in email
 * Path:/resend-verify-email
 * Method :POST
 * Headers:{Authorization:Bearer <access_token>}
 * Body:{}
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))
/**
 * Description :Submit email to reset password,send email to user
 * Path:/resend-verify-email
 * Method :POST
 * Body:{email:string}
 */
usersRouter.post('/forgot-password', forgotPassswordValidator, wrapRequestHandler(forgotPasswordController))
/**
 * Description :Verify link in email  to reset password
 * Path:/verify-forgot-email
 * Method :POST
 * Body:{forgot_password_token:string}
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)
/**
 * Description :Reset password
 * Path:/reset-password
 * Method :POST
 * Body:{forgot_password_token:string,password:string,confirm_password:string}
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))
/**
 * Description :Get my profile
 * Path:/me
 * Method :GET
 * Header :Headers:{Authorization:Bearer <access_token>}

 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))
/**
 * Description :Update my profile
 * Path:/me
 * Method :PATCH
 * Header :Headers:{Authorization:Bearer <access_token>}
 * Body:UserSchema

 */
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifyUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)
/**
 * Description :Get user profile
 * Path:/:username
 * Method :GET
 */
usersRouter.get('/:username', wrapRequestHandler(getProfileController))
/**
 * Description :Follow someone
 * Path:/:follow
 * Method :POST
 * Header :{Authorization:Bearer<access_token>}
 * Body:{followed_user_id:string}
 */
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifyUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)
/**
 * Description :UnFollow someone
 * Path:follow/:user_id
 * Method :POST
 * Header :{Authorization:Bearer<access_token>}
 * Body:{user_id:string}
 */
usersRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifyUserValidator,
  unFollowValidator,
  wrapRequestHandler(unFollowController)
)
/**
 * Description :Change password
 * Path:/change-password
 * Method :PUT
 * Header :{Authorization:Bearer<access_token>}
 * Body:{old_password:string,password:string,confirm_password:string}
 */
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifyUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

export default usersRouter

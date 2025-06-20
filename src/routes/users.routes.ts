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
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: levangiau20032020@gmail.com
 *         password:
 *           type: string
 *           example: 'Giau123!'
 *     SuccessAuthentication:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         refresh_token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: MongoId
 *           example: 676b20d826df7dbc97381ac4
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
 *           example: ['676b20d826df7dbc97381ac4', '64be0ad2e43d2464394feedc']
 *         bio:
 *           type: string
 *           example: 'This is my bio.'
 *         location:
 *           type: string
 *           example: 'San Francisco, CA'
 *         website:
 *           type: string
 *           example: 'https://www.example.com'
 *         username:
 *           type: string
 *           example: 'johndoe'
 *         avatar:
 *           type: string
 *           example: 'http://localhost:8000/images/avatars/johndoe.jpg'
 *         cover_photo:
 *           type: string
 *           example: 'http://localhost:8000/images/covers/johndoe.jpg'
 *     UserVerifyStatus:
 *       type: number
 *       enum: [0, 1, 2]
 *       example: 1
 *     RegisterBody:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - confirm_password
 *         - date_of_birth
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: duthanhduoc100@gmail.com
 *         password:
 *           type: string
 *           example: Duoc123!
 *         confirm_password:
 *           type: string
 *           example: Duoc123!
 *         date_of_birth:
 *           type: string
 *           format: date-time
 *           example: 2023-06-08T10:17:31.096Z
 *     UpdateMeBody:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         date_of_birth:
 *           type: string
 *           format: date-time
 *           example: 2023-06-08T10:17:31.096Z
 *         bio:
 *           type: string
 *           example: 'This is my bio.'
 *         location:
 *           type: string
 *           example: 'San Francisco, CA'
 *         website:
 *           type: string
 *           example: 'https://www.example.com'
 *         username:
 *           type: string
 *           example: 'johndoe'
 *         avatar:
 *           type: string
 *           example: 'http://localhost:8000/images/avatars/johndoe.jpg'
 *         cover_photo:
 *           type: string
 *           example: 'http://localhost:8000/images/covers/johndoe.jpg'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * @swagger
 * /users/oauth/google:
 *   get:
 *     summary: OAuth with Google
 *     description: Authenticate user via Google OAuth.
 *     operationId: oauthGoogle
 *     tags:
 *       - users
 *     parameters:
 *       - name: code
 *         in: query
 *         description: Google OAuth authorization code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OAuth successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OAuth successful
 *                 result:
 *                   $ref: '#/components/schemas/SuccessAuthentication'
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.get('/oauth/google', wrapRequestHandler(oauthController))

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account.
 *     operationId: register
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       description: User registration details
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterBody'
 *     responses:
 *       '200':
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Register success
 *                 result:
 *                   $ref: '#/components/schemas/SuccessAuthentication'
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: User Logout
 *     description: Log out the current user.
 *     operationId: logout
 *     tags:
 *       - users
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Refresh token for logout
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       '200':
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout success
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Refresh Access Token
 *     description: Refresh access token using refresh token.
 *     operationId: refreshToken
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       description: Refresh token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       '200':
 *         description: Token refresh successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Refresh token success
 *                 result:
 *                   $ref: '#/components/schemas/SuccessAuthentication'
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * @swagger
 * /users/verify-email:
 *   post:
 *     summary: Verify Email
 *     description: Verify user account using email token.
 *     operationId: verifyEmail
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       description: Email verification token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email_verify_token
 *             properties:
 *               email_verify_token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       '200':
 *         description: Email verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email verified successfully
 *                 result:
 *                   $ref: '#/components/schemas/SuccessAuthentication'
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(emailVerifyController))

/**
 * @swagger
 * /users/resend-verify-email:
 *   post:
 *     summary: Resend Verification Email
 *     description: Resend email verification link.
 *     operationId: resendVerifyEmail
 *     tags:
 *       - users
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       description: User email
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: duthanhduoc100@gmail.com
 *     responses:
 *       '200':
 *         description: Verification email resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification email resent successfully
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Forgot Password
 *     description: Send password reset email.
 *     operationId: forgotPassword
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       description: User email
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: duthanhduoc100@gmail.com
 *     responses:
 *       '200':
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset email sent successfully
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.post('/forgot-password', forgotPassswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * @swagger
 * /users/verify-forgot-password:
 *   post:
 *     summary: Verify Password Reset Token
 *     description: Verify token for password reset.
 *     operationId: verifyForgotPassword
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       description: Password reset token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - forgot_password_token
 *             properties:
 *               forgot_password_token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       '200':
 *         description: Token verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token verified successfully
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset Password
 *     description: Reset user password using token.
 *     operationId: resetPassword
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       description: Password reset details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - forgot_password_token
 *               - password
 *               - confirm_password
 *             properties:
 *               forgot_password_token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               password:
 *                 type: string
 *                 example: Duoc123!
 *               confirm_password:
 *                 type: string
 *                 example: Duoc123!
 *     responses:
 *       '200':
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get Current User
 *     description: Retrieve current user’s profile.
 *     operationId: getMe
 *     tags:
 *       - users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get user profile successfully
 *                 result:
 *                   $ref: '#/components/schemas/User'
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update Current User
 *     description: Update current user’s profile.
 *     operationId: updateMe
 *     tags:
 *       - users
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       description: User profile updates
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMeBody'
 *     responses:
 *       '200':
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 result:
 *                   $ref: '#/components/schemas/User'
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 * @swagger
 * /users/{username}:
 *   get:
 *     summary: Get User by Username
 *     description: Retrieve user information by username.
 *     operationId: getUserByUsername
 *     tags:
 *       - users
 *     parameters:
 *       - name: username
 *         in: path
 *         description: Username of the user
 *         required: true
 *         schema:
 *           type: string
 *           example: johndoe
 *     responses:
 *       '200':
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get user successfully
 *                 result:
 *                   $ref: '#/components/schemas/User'
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.get('/:username', wrapRequestHandler(getProfileController))

/**
 * @swagger
 * /users/follow:
 *   post:
 *     summary: Follow a User
 *     description: Follow another user.
 *     operationId: followUser
 *     tags:
 *       - users
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       description: User to follow
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - followed_user_id
 *             properties:
 *               followed_user_id:
 *                 type: string
 *                 format: MongoId
 *                 example: 676b20d826df7dbc97381ac4
 *     responses:
 *       '200':
 *         description: Follow successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Follow user successfully
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifyUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)

/**
 * @swagger
 * /users/follow/{user_id}:
 *   delete:
 *     summary: Unfollow a User
 *     description: Unfollow a user.
 *     operationId: unfollowUser
 *     tags:
 *       - users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: user_id
 *         in: path
 *         description: ID of the user to unfollow
 *         required: true
 *         schema:
 *           type: string
 *           format: MongoId
 *           example: 676b20d826df7dbc97381ac4
 *     responses:
 *       '200':
 *         description: Unfollow successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unfollow user successfully
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifyUserValidator,
  unFollowValidator,
  wrapRequestHandler(unFollowController)
)

/**
 * @swagger
 * /users/change-password:
 *   put:
 *     summary: Change Password
 *     description: Change the current user’s password.
 *     operationId: changePassword
 *     tags:
 *       - users
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Password change details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - old_password
 *               - password
 *               - confirm_password
 *             properties:
 *               old_password:
 *                 type: string
 *                 example: Duoc123!
 *               password:
 *                 type: string
 *                 example: Duoc1234!
 *               confirm_password:
 *                 type: string
 *                 example: Duoc1234!
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       '422':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifyUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

export default usersRouter

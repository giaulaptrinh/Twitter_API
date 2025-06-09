/* eslint-disable @typescript-eslint/no-require-imports */
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { config } from 'dotenv'

import fs, { access } from 'fs'
import path from 'path'

config()
// Create SES service object.
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  }
})

const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = []
}: {
  fromAddress: string
  toAddresses: string | string[]
  ccAddresses?: string | string[]
  body: string
  subject: string
  replyToAddresses?: string | string[]
}) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
  })
}

export const sendVerifyEmail = async (toAddress: string, subject: string, body: string) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: process.env.SES_FROM_ADDRESS as string,
    toAddresses: toAddress,
    body,
    subject
  })

  try {
    return await sesClient.send(sendEmailCommand)
  } catch (e) {
    console.error('Failed to send email.')
    return e
  }
}

// sendVerifyEmail('levangiau20032020@gmail.com', 'Tiêu đề email test ', '<h1>Nội dung email test</h1>')

const verifyEmailTemplate = fs.readFileSync(path.resolve('src/templates/verify-email.html'), 'utf-8')
// console.log('verifyEmailTemplate', verifyEmailTemplate)
export const sendVerifyRegisterEmail = (
  toAddress: string,
  email_verify_token: string,
  template: string = verifyEmailTemplate
) => {
  return sendVerifyEmail(
    toAddress,
    'Verify your email',
    template
      .replace('{{title}}', 'Verify your email address 2')
      .replace('{{content}}', 'Click here to verify email 1.')
      .replace('{{titleLink}}', 'Verify Email 1')
      .replace(/{{link}}/g, `${process.env.CLIENT_URL}/verify-email?token=${email_verify_token}`)
  )
}
export const sendForgotPasswordEmail = (toAddress: string, reset_password_token: string) => {
  return sendVerifyEmail(
    toAddress,
    'Forgot password',
    verifyEmailTemplate
      .replace('{{title}}', 'Reset your password')
      .replace('{{content}}', 'Click here to reset your password.')
      .replace('{{titleLink}}', 'Reset Password')
      .replace('{{link}}', `${process.env.CLIENT_URL}/forgot-password?token=${reset_password_token}`)
  )
}

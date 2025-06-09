/* eslint-disable @typescript-eslint/no-require-imports */
const { SendEmailCommand, SESClient, GetIdentityVerificationAttributesCommand } = require('@aws-sdk/client-ses')
const { config } = require('dotenv')

config()
// Create SES service object.
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID
  }
})

const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = []
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

export const sendVerifyEmail = async (toAddress, subject, body) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: process.env.SES_FROM_ADDRESS,
    toAddresses: toAddress,
    body,
    subject
  })

  // try {
  //   return await sesClient.send(sendEmailCommand)
  // } catch (e) {
  //   console.error('Failed to send email.')
  //   return e
  // }
  return sesClient.send(sendEmailCommand)
}
// console.log('AWS_REGION:', process.env.AWS_REGION)
// console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID)
// console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY)
// console.log('SES_FROM_ADDRESS:', process.env.SES_FROM_ADDRESS)
// sendVerifyEmail(
//   'levangiau20032020@gmail.com',
//   'Tiêu đề email test cmmmmmm 2h37',
//   '<h1>Nội dung email test levamgiau 31/5/20225 2h32</h1>'
// )

// const sendVerifyEmail = async (toAddress, subject, body) => {
//   const sendEmailCommand = createSendEmailCommand({
//     fromAddress: process.env.SES_FROM_ADDRESS,
//     toAddresses: toAddress,
//     body,
//     subject
//   })

//   try {
//     const result = await sesClient.send(sendEmailCommand)
//     console.log('Email sent successfully:', result)
//     return result
//   } catch (error) {
//     console.error('Failed to send email:', error.message)
//     console.error('Error details:', error)
//     throw error
//   }
// }
// async function checkEmailVerification(email) {
//   const command = new GetIdentityVerificationAttributesCommand({
//     Identities: [email]
//   })

//   try {
//     const response = await sesClient.send(command)
//     console.log('Verification status:', response.VerificationAttributes)
//     return response
//   } catch (error) {
//     console.error('Error checking verification:', error)
//     throw error
//   }
// }

// // Gói tất cả các operations vào một async function
// async function main() {
//   try {
//     // Kiểm tra trạng thái verify trước
//     console.log('Checking sender email verification...')
//     await checkEmailVerification(process.env.SES_FROM_ADDRESS)

//     console.log('Checking recipient email verification...')
//     await checkEmailVerification('levangiau20032020@gmail.com')

//     // Sau đó gửi email
//     await sendVerifyEmail('levangiau20032020@gmail.com', 'Tiêu đề email test', '<h1>Nội dung email test</h1>')
//     console.log('Email sent successfully')
//   } catch (error) {
//     console.error('Main error:', error)
//   }
// }

// // Gọi function main
// main()

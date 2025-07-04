import { ObjectId } from 'mongodb'
import { Server } from 'socket.io' // Added Socket.IO import
import Conversation from '~/models/schemas/Conversation.schema'
import databaseService from '~/services/database.services'
import { verifyAccessToken } from './commons'
import { TokenPayload } from '~/models/requests/User.requests'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { UserVerifyStatus } from '~/constants/enum'
import { Server as ServerHttp } from 'http'

const initSocket = (httpServer: ServerHttp) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  })

  const users: {
    [key: string]: {
      socket_id: string
    }
  } = {}

  // Global middleware for authentication
  io.use(async (socket, next) => {
    const { Authorization } = socket.handshake.auth
    const access_token = Authorization?.split(' ')[1]

    try {
      const decoded_authorization = await verifyAccessToken(access_token)
      const { verify } = decoded_authorization as TokenPayload

      if (verify !== UserVerifyStatus.Verified) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.USER_NOT_VERIFIED,
          status: HTTP_STATUS.FORBIDDEN
        })
      }

      // Store auth data in socket handshake
      socket.handshake.auth.decoded_authorization = decoded_authorization
      socket.handshake.auth.access_token = access_token
      next()
    } catch (error) {
      next({
        message: 'Unauthorized',
        name: 'UnauthorizedError',
        data: error
      })
    }
  })

  io.on('connection', (socket) => {
    const { user_id } = socket.handshake.auth.decoded_authorization as TokenPayload
    users[user_id] = {
      socket_id: socket.id
    }

    // Per-socket middleware for token verification
    socket.use(async (packet, next) => {
      const { access_token } = socket.handshake.auth
      try {
        await verifyAccessToken(access_token)
        next()
      } catch (error) {
        next(new Error('Unauthorized'))
      }
    })

    // Error handling
    socket.on('error', (err) => {
      if (err.message === 'Unauthorized') {
        socket.disconnect()
      }
    })

    socket.on('connect_error', (error) => {
      console.log(`connect_error due to ${error.message}`)
    })

    // Message handling
    socket.on('send_message', async (data) => {
      try {
        const { receiver_id, sender_id, content } = data.payload
        const receiver_socket_id = users[receiver_id]?.socket_id

        const conversation = new Conversation({
          sender_id: ObjectId.createFromHexString(sender_id),
          receiver_id: ObjectId.createFromHexString(receiver_id),
          content: content
        })

        const result = await databaseService.conversations.insertOne(conversation)
        conversation._id = result.insertedId

        if (receiver_socket_id) {
          socket.to(receiver_socket_id).emit('receive_message', {
            payload: conversation
          })
        }
      } catch (error) {
        console.error('Error sending message:', error)
        socket.emit('error', { message: 'Failed to send message' })
      }
    })

    socket.on('disconnect', () => {
      delete users[user_id]
      console.log(`user disconnected ${socket.id}`)
    })
  })
}

export default initSocket

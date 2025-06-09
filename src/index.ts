import express from 'express'
import usersRoutes from './routes/users.routes'
import databaseService from './services/database.services'
import mediasRoutes from './routes/medias.routes'
import { initFolder } from './utils/file'
import { UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRoutes from './routes/static.routes'
import { config } from 'dotenv'
import tweetsRoutes from './routes/tweets.routes'
import bookmarksRoutes from './routes/bookmarks.routes'
import likesRoutes from './routes/likes.routes'
import searchRoutes from './routes/search.routes'
import cors from 'cors'
import './utils/s3'
import conversationRoutes from './routes/conversation.routes'
import { createServer } from 'http'
import initSocket from './utils/socket'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import argv from 'minimist'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import { env } from 'process'
import { envConfig, isProduction } from './constants/config'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'X Clone(Twitter API)',
      version: '1.0.0'
    }
  },
  // apis: ['./openapi/*.yaml']
  // apis: ['./twitter-swagger.yaml'] // Path to the API docs
  apis: ['./src/routes/*.routes.ts'] // Path to the API docs
}
const openapiSpecification = swaggerJsdoc(options)

const app = express()
// app.use(
//   cors({
//     origin: '*' // Allow all origins, or specify your front-end URL
//   })
// )
const corsOptions = {
  origin: isProduction ? envConfig.clientUrl : '*' // Chỉ cho phép client URL trong môi trường production
}
// app.use(cors(corsOptions))
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 minutes
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false
})
app.use(limiter)
const httpServer = createServer(app)
const PORT = envConfig.port || 8000
// Lấy options từ command line
const cmdOptions = argv(process.argv.slice(2))

// Tải .env dựa trên môi trường
try {
  config({
    path: cmdOptions.env ? `.env.${cmdOptions.env}` : '.env'
  })
} catch (error) {
  console.error('Error loading .env file:', error)
}

const port = process.env.PORT
console.log('PORT', port)

initFolder()
// app.use(
//   cors({
//     origin: true,
//     methods: 'GET,POST,PUT,DELETE',
//     allowedHeaders: 'Content-Type,Authorization',
//     credentials: true
//   })
// )
app.use(helmet())
app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
app.use('/users', usersRoutes)
app.use('/medias', mediasRoutes)
app.use('/tweets', tweetsRoutes)
app.use('/bookmarks', bookmarksRoutes)
app.use('/likes', likesRoutes)
app.use('/search', searchRoutes)
app.use('/conversations', conversationRoutes)
app.use('/static', staticRoutes)
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))

databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexFollowers()
  databaseService.indexTweets()
})

app.use(defaultErrorHandler)
initSocket(httpServer)

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

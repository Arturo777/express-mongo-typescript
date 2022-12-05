import * as express from 'express'
import * as mongoose from 'mongoose'
import * as  http from 'http'
import { config } from './config/config'
// import Logging from './library/Logging'
import authorRoutes from './routes/Author'

const router = express()

mongoose.connect(config.mongo.url, {
  retryWrites: true,
  w: 'majority',
})
  .then(() => {
    console.log('Connected to mongoDB')
    StartServer()
  })
  .catch(error => {
    console.log(`Unable to connect: `)
    console.log(error)
  })

const StartServer = () => {
  router.use((req, res, next) => {
    /* LOG THE REQUEST */
    console.log({
      Incoming: {
        method: req.method,
        url: req.url,
        ip: req.socket.remoteAddress
      }
    })

    res.on('finish', () => {
      /* LOG THE RESPONSE */
      console.log({
        Incoming: {
          method: req.method,
          url: req.url,
          ip: req.socket.remoteAddress,
          status: res.statusCode,
        }
      })

    })

    next()
  })

  router.use(express.urlencoded({ extended: true }))
  router.use(express.json())

  /** Rules of our API */
  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({})
    }

    next()
  })

  /** Routes */
  router.use('/authors', authorRoutes)
  // router.use('/books', bookRoutes);

  /* Health check */
  router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong', }))

  /** Error Handling */
  router.use((req, res, next) => {
    const error = new Error('Not found')
    console.log({ error });

    return res.status(404).json({ message: error.message })
  })

  http.createServer(router).listen(config.server.port, () => console.log(`Server running on port ${config.server.port}`))
}
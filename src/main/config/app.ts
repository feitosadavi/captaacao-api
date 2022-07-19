/* eslint-disable @typescript-eslint/require-await */
import express from 'express'
import { setupApolloServer } from '../graphql/apollo'
import setupRoutes from './routes'
import cors from 'cors'
import { createServer, Server } from 'http'
import path from 'path'

export const setupApp = async (): Promise<Server> => {
  const app = express()
  // app.use(express.json())
  // app.use(express.urlencoded({ extended: true }))
  app.use(cors({ origin: '*' }))

  setupRoutes(app)

  const httpServer = createServer(app)

  app.get('/graphql', (req, res) => {
    res.sendFile(path.join(__dirname, '../static/graphiql-over-ws.html'))
  })
  const server = setupApolloServer(httpServer)
  await server.start()
  server.applyMiddleware({ app })

  return httpServer
}

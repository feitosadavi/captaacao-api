/* eslint-disable @typescript-eslint/require-await */
import express, { Express } from 'express'
import { setupApolloServer } from '../graphql/apollo'
import setupRoutes from './routes'
import { cors } from '../middlewares'

export const setupApp = async (): Promise<Express> => {
  const app = express()
  app.use(cors)
  setupRoutes(app)
  const server = setupApolloServer()
  await server.start()
  server.applyMiddleware({ app })
  return app
}

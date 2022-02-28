/* eslint-disable @typescript-eslint/require-await */
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import setupSwagger from './config-swagger'

import express, { Express } from 'express'
import { setupApolloServer } from '../graphql/apollo'

export const setupApp = async (): Promise<Express> => {
  const app = express()
  setupSwagger(app)
  setupMiddlewares(app)
  setupRoutes(app)
  const server = setupApolloServer()
  await server.start()
  server.applyMiddleware({ app })
  return app
}

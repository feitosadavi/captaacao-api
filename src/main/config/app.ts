/* eslint-disable @typescript-eslint/require-await */
import express, { Express } from 'express'
import { setupApolloServer } from '../graphql/apollo'

export const setupApp = async (): Promise<Express> => {
  const app = express()
  const server = setupApolloServer()
  await server.start()
  server.applyMiddleware({ app })
  return app
}

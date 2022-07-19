/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/require-await */
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServer } from 'apollo-server-express'
import { GraphQLError, print } from 'graphql'
import { Server } from 'http'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { PubSub } from 'graphql-subscriptions'
import { GraphQLLiveDirective } from '@n1ru4l/graphql-live-query'

import typeDefs from '@/main/graphql/type-defs'
import resolvers from '@/main/graphql/resolvers'
import { authDirectiveTransformer } from '@/main/graphql/directives'
import { astFromDirective } from '@graphql-tools/utils'

const handleErrors = (response: any, errors: readonly GraphQLError[]): void => {
  errors?.forEach(error => {
    response.data = undefined
    if (checkError(error, 'UserInputError')) {
      response.http.status = 400
    } else if (checkError(error, 'AuthenticationError')) {
      response.http.status = 401
    } else if (checkError(error, 'ForbiddenError')) {
      response.http.status = 403
    } else {
      response.http.status = 500
    }
  })
}

const checkError = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError?.name].some(name => name === errorName)
}

const liveDirectiveTypeDefs = print(
  // @ts-ignore: Unreachable code error
  astFromDirective(GraphQLLiveDirective)
)

let schema = makeExecutableSchema({ resolvers, typeDefs: [...typeDefs, liveDirectiveTypeDefs] })
schema = authDirectiveTransformer(schema)

export const setupApolloServer = (httpServer: Server): ApolloServer => {
  const wsServer = new WebSocketServer({
    path: '/graphql',
    server: httpServer
  })

  const serverCleanup = useServer({ schema }, wsServer)

  const pubsub = new PubSub()
  return new ApolloServer({
    schema,
    context: ({ req }) => ({ req, pubsub }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        serverWillStart: async () => ({
          drainServer: async () => await serverCleanup.dispose()
        }),
        requestDidStart: async () => ({
          willSendResponse: async ({ response, errors }) => handleErrors(response, errors)
        })
      }]
  })
}

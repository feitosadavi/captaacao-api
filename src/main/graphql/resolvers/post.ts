import { adaptResolver } from '@/main/adapters'
import { makeAddPostController, makeLoadAllPostsController, makeLoadPostByIdController } from '@/main/factories'
import { makeDeletePostController } from '@/main/factories/controllers/post/delete-profile-controller-factory'
import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()

export default {
  Mutation: {
    addPost: async (parent: any, args: any, context: any) => adaptResolver(makeAddPostController(), args, context),
    deletePost: async (parent: any, args: any, context: any) => adaptResolver(makeDeletePostController(), args, context)
  },

  Query: {
    posts: async (parent: any, args: any) => {
      const res = await adaptResolver(makeLoadAllPostsController(), args)
      // await pubsub.publish('PEGA_TUDO', {
      //   pegaTudo: res.posts
      // })
      return res
    },
    post: async (parent: any, args: any) => adaptResolver(makeLoadPostByIdController(), args)
  },

  Subscription: {
    pegaTudo: {
      subscribe: () => pubsub.asyncIterator('PEGA_TUDO')
    }
  }
}

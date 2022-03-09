import { adaptResolver } from '@/main/adapters'
import { makeAddPostController, makeLoadAllPostsController, makeLoadPostByIdController } from '@/main/factories'
import { makeDeletePostController } from '@/main/factories/controllers/post/delete-profile-controller-factory'

export default {
  Mutation: {
    addPost: async (parent: any, args: any, context: any) => adaptResolver(makeAddPostController(), args, context),
    deletePost: async (parent: any, args: any, context: any) => adaptResolver(makeDeletePostController(), args, context)
  },

  Query: {
    posts: async (parent: any, args: any) => adaptResolver(makeLoadAllPostsController(), args),
    post: async (parent: any, args: any) => adaptResolver(makeLoadPostByIdController(), args)
  }
}

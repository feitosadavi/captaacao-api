import { adaptResolver } from '@/main/adapters'
import { makeDeletePostController } from '@/main/factories/controllers/post/delete-profile-controller-factory'

export default {
  Mutation: {
    delete: async (parent: any, args: any, context: any) => adaptResolver(makeDeletePostController(), args, context)
  }
}

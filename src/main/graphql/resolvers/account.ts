import { adaptResolver } from '@/main/adapters'
import { makeLoadAllAccountsController, makeLoginController, makeSignUpController } from '@/main/factories'

export default {
  Query: {
    login: async (parent: any, args: any) => adaptResolver(makeLoginController(), args),
    accounts: async (parent: any, args: any) => adaptResolver(makeLoadAllAccountsController(), args)
  },

  Mutation: {
    signUp: async (parent: any, args: any) => adaptResolver(makeSignUpController(), args)
  }
}

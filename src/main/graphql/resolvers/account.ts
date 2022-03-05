import { adaptResolver } from '@/main/adapters'
import { makeLoadAccountByIdController, makeLoadAllAccountsController, makeLoginController, makeSignUpController, makeUpdateAccountControllerFactory } from '@/main/factories'

export default {
  Query: {
    login: async (parent: any, args: any) => adaptResolver(makeLoginController(), args),
    accounts: async (parent: any, args: any) => adaptResolver(makeLoadAllAccountsController(), args),
    account: async (parent: any, args: any) => adaptResolver(makeLoadAccountByIdController(), args)
  },

  Mutation: {
    signUp: async (parent: any, args: any) => adaptResolver(makeSignUpController(), args),
    update: async (parent: any, args: any, context) => adaptResolver(makeUpdateAccountControllerFactory(), args, context)
  }
}

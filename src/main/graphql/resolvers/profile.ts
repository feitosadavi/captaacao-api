import { adaptResolver } from '@/main/adapters'
import { makeLoadProfilesController } from '@/main/factories'

export default {
  Query: {
    profiles: async (parent: any, args: any) => adaptResolver(makeLoadProfilesController())
  }
}

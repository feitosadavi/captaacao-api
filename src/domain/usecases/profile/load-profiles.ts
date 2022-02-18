import { ProfileModel } from '@/domain/models'

export interface LoadProfiles {
  load (): Promise<LoadProfiles.Result>
}

export namespace LoadProfiles {
  export type Result = ProfileModel[]
}

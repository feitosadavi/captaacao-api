export interface ProfileNameIsInUseRepository {
  nameIsInUse (params: ProfileNameIsInUseRepository.Params): Promise<ProfileNameIsInUseRepository.Result>
}

export namespace ProfileNameIsInUseRepository {
  export type Params = {
    name: string
  }
  export type Result = boolean
}

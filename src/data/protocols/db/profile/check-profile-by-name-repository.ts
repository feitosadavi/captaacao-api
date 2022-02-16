export interface CheckProfileByNameRepository {
  checkByName (params: CheckProfileByNameRepository.Params): Promise<CheckProfileByNameRepository.Result>
}

export namespace CheckProfileByNameRepository {
  export type Params = {
    name: string
  }
  export type Result = boolean
}

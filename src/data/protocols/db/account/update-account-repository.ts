export interface UpdateAccountRepository {
  update (params: UpdateAccountRepository.Params): Promise<UpdateAccountRepository.Result>
}

export namespace UpdateAccountRepository {
  export type Params = [Record<string, any>]
  export type Result = boolean
}

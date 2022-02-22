export interface UpdateAccessTokenRepository {
  updateAccessToken (params: UpdateAccessTokenRepository.Params): UpdateAccessTokenRepository.Result
}

export namespace UpdateAccessTokenRepository {
  export type Params = {
    id: string
    accessToken: string
  }
  export type Result = Promise<void>
}

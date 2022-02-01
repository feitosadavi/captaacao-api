export interface SetupEmailRepository{
  setup (params: SetupEmailRepository.Params): SetupEmailRepository.Result
}

export namespace SetupEmailRepository{
  export type Params = {
    service: string
    user: string
    pass: string
  }
  export type Result = void
}

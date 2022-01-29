export interface SetupEmail {
  setup (params: SetupEmail.Params): SetupEmail.Result
}

export namespace SetupEmail {
  export type Params = {
    service: string
    user: string
    pass: string
  }
  export type Result = void
}

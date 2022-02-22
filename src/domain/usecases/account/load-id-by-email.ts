export interface LoadIdByEmail {
  load (params: LoadIdByEmail.Params): LoadIdByEmail.Result
}

export namespace LoadIdByEmail {
  export type Params = {
    email: string
  }
  export type Result = Promise<string>
}

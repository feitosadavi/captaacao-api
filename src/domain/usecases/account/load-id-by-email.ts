export interface LoadIdByEmail {
  load (params: LoadIdByEmail.Params): Promise<string>
}

export namespace LoadIdByEmail {
  export type Params = {
    email: string
  }
  export type Result = string
}

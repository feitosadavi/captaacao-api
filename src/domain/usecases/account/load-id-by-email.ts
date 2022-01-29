export interface LoadIdByEmail {
  load (params: LoadIdByEmail.Params): Promise<string>
}

export namespace LoadIdByEmail {
  export type Params = {
    id: string
  }
  export type Result = string
}

export interface CodeMatches {
  matches (params: CodeMatches.Params): CodeMatches.Result
}

export namespace CodeMatches {
  export type Params = {
    first: number
    second: number
  }
  export type Result = boolean
}

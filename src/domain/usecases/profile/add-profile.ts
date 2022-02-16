export interface AddProfile {
  add (account: AddProfile.Params): Promise<AddProfile.Result>
}

export namespace AddProfile {
  export type Params = {
    name: string
  }

  export type Result = boolean
}

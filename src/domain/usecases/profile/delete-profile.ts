export interface DeleteProfile {
  delete (params: DeleteProfile.Params): Promise<DeleteProfile.Result>
}

export namespace DeleteProfile {
  export type Params = {
    id: string
  }
  export type Result = boolean
}

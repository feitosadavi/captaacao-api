export interface DeleteAccount {
  delete (params: DeleteAccount.Params): DeleteAccount.Result
}

export namespace DeleteAccount {
  export type Params = {
    id: string
  }
  export type Result = Promise<boolean>
}

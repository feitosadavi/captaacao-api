export interface AddProfileRepository {
  add (params: AddProfileRepository.Params): Promise<AddProfileRepository.Result>
}

export namespace AddProfileRepository {
  export type Params = {
    name: string
    createdBy: string
    createdAt: Date
  }
  export type Result = boolean
}

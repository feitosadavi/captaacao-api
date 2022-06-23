export interface AddFavouritePost {
  add (params: AddFavouritePost.Params): AddFavouritePost.Result
}

export namespace AddFavouritePost {
  export type Params = {
    id: string
    favouritePostId: string
  }
  export type Result = Promise<{ ok: boolean }>
}

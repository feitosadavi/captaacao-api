export interface RemoveFavouritePost {
  remove (params: RemoveFavouritePost.Params): RemoveFavouritePost.Result
}

export namespace RemoveFavouritePost {
  export type Params = {
    id: string
    favouritePostId: string
  }
  export type Result = Promise<{ ok: boolean }>
}

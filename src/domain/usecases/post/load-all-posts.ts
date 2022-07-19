import { PostModel } from '@/domain/models'

export interface LoadAllPosts {
  load (params: LoadAllPosts.Params): Promise<LoadAllPosts.Result>
}

export namespace LoadAllPosts {
  export type Params = {
    loadFilterOptions?: boolean
    postedBy?: string
    search?: string
    skip?: number
    count?: boolean
    limit?: number
    color?: string[]
    brand?: string[]
    year?: number[]
    steering?: string[]
    engine?: string[]
    doors?: number[]
  }
  export type FilterOptions = {
    brand: string[]
    model: string[]
    fuel: string[]
    year: string[]
    color: string[]
    doors: number[]
    steering: string[]
  }
  export type Result = { posts: PostModel[], filterOptions?: FilterOptions, count?: { sold: number, notSold: number } }
}

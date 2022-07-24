import { LoadAllPosts } from '@/domain/usecases'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class LoadAllPostsController implements Controller<LoadAllPostsController.Request> {
  constructor (private readonly loadPosts: LoadAllPosts) { }
  async handle (request: LoadAllPostsController.Request): Promise<HttpResponse> {
    try {
      const filters = {}
      for (const key of Object.keys(request)) {
        filters[key] = request[key]
      }
      const posts = await this.loadPosts.load(filters)
      return posts.posts.length ? serverSuccess(posts) : noContent()
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}

export namespace LoadAllPostsController {
  export type Request = LoadAllPosts.Params

  // price: number
  // brand: string
  // model: string
  // year: number
  // color: string
  // doors: number
  // steering: string
}

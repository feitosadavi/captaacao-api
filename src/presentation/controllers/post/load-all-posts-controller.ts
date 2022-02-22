import { LoadAllPosts } from '@/domain/usecases'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class LoadAllPostsController implements Controller<LoadAllPostsController.Request> {
  constructor (private readonly loadPosts: LoadAllPosts) { }
  async handle (request: LoadAllPostsController.Request): Promise<HttpResponse> {
    try {
      const posts = await this.loadPosts.load()
      return posts.length ? serverSuccess(posts) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadAllPostsController {
  export type Request = any
}

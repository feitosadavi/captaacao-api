import { LoadPosts } from '@/domain/usecases'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoadPostsController implements Controller {
  constructor (private readonly loadPosts: LoadPosts) { }
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const posts = await this.loadPosts.load()
      return posts.length ? serverSuccess(posts) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

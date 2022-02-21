import { LoadAllPosts } from '@/domain/usecases'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoadAllPostsController implements Controller {
  constructor (private readonly loadPosts: LoadAllPosts) { }
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const posts = await this.loadPosts.load()
      return posts.length ? serverSuccess(posts) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

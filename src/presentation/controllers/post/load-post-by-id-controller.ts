import { LoadPostById } from '@/domain/usecases'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoadPostByIdController implements Controller {
  constructor (private readonly loadPostById: LoadPostById) { }
  async handle (httpRequest: HttpRequest<any, any, {id: string}>): Promise<HttpResponse> {
    try {
      const post = await this.loadPostById.loadById(httpRequest.params.id)
      return post ? serverSuccess(post) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

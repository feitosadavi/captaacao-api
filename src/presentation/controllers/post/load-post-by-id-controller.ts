import { LoadPostById } from '@/domain/usecases'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoadPostByIdController implements Controller {
  constructor (private readonly loadPostById: LoadPostById) { }
  async handle (httpRequest: HttpRequest<any, any, LoadPostById.Params>): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params
      const post = await this.loadPostById.load({ id })
      return post ? serverSuccess(post) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

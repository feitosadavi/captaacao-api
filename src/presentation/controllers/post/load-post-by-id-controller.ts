import { LoadPostById } from '@/domain/usecases'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class LoadPostByIdController implements Controller<LoadPostByIdController.Request> {
  constructor (private readonly loadPostById: LoadPostById) { }
  async handle (request: LoadPostByIdController.Request): Promise<HttpResponse> {
    try {
      const { id } = request
      const post = await this.loadPostById.load({ id })
      return post ? serverSuccess(post) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadPostByIdController {
  export type Request = {
    id: string
  }
}

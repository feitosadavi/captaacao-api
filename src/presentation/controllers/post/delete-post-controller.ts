import { DeletePost, LoadPostById } from '@/domain/usecases'
import { serverError, serverSuccess, unauthorized } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class DeletePostController implements Controller<DeletePostController.Request> {
  constructor (
    private readonly deletePost: DeletePost,
    private readonly loadPostById: LoadPostById
  ) { }

  async handle (request: DeletePostController.Request): Promise<HttpResponse> {
    try {
      const { id, accountId } = request
      const post = await this.loadPostById.load({ id })

      if (post.postedBy !== accountId) return unauthorized()

      const result = await this.deletePost.delete({ id })
      return serverSuccess(result)
    } catch (e) {
      return serverError(e)
    }
  }
}

export namespace DeletePostController {
  export type Request = {
    id: string
    accountId: string
  }
}

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

      console.log({ postedBy: post.postedBy.id, accountId })
      if (post.postedBy.id.toString() !== accountId.toString()) return unauthorized() // just works with toString, dont know exactly why

      const result = await this.deletePost.delete({ id })
      console.log({ result })
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

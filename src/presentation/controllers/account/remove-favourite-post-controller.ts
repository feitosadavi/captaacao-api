import { RemoveFavouritePost } from '@/domain/usecases'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class RemoveFavouritePostController implements Controller<RemoveFavouritePostController.Request> {
  // eslint-disable-next-line space-before-function-paren
  constructor(
    private readonly validation: Validation,
    private readonly removeFavourite: RemoveFavouritePost
  ) { }

  async handle (request: RemoveFavouritePostController.Request): Promise<HttpResponse> {
    try {
      const { accountId, ...body } = request // exclude id
      const error = this.validation.validate(body)
      if (error) {
        return badRequest(error)
      }

      const result = await this.removeFavourite.remove({ id: accountId, favouritePostId: body.favouritePostId })
      return serverSuccess(result)
    } catch (e) {
      console.log(e)
      return serverError(e)
    }
  }
}

export namespace RemoveFavouritePostController {
  export type Request = {
    accountId: string
    favouritePostId: string
  }
}

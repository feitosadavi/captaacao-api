import { AddFavouritePost } from '@/domain/usecases'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class AddFavouritePostController implements Controller<AddFavouritePostController.Request> {
  // eslint-disable-next-line space-before-function-paren
  constructor(
    private readonly validation: Validation,
    private readonly addFavourite: AddFavouritePost
  ) { }

  async handle (request: AddFavouritePostController.Request): Promise<HttpResponse> {
    try {
      const { accountId, favouritePostId, ...fields } = request // exclude id
      const error = this.validation.validate(fields)
      if (error) {
        return badRequest(error)
      }

      const result = await this.addFavourite.add({ id: accountId, favouritePostId })
      return serverSuccess(result)
    } catch (e) {
      return serverError(e)
    }
  }
}

export namespace AddFavouritePostController {
  export type Request = {
    accountId: string
    favouritePostId: string
  }
}

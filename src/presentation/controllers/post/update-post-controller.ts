import { PostModel } from '@/domain/models'
import { UpdatePost } from '@/domain/usecases'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class UpdatePostController implements Controller<UpdatePostController.Request> {
  // eslint-disable-next-line space-before-function-paren
  constructor(
    private readonly validation: Validation,
    private readonly updatePost: UpdatePost
  ) { }

  async handle (request: UpdatePostController.Request): Promise<HttpResponse> {
    try {
      const { accountId, ...fields } = request // exclude id
      const error = this.validation.validate(fields)
      if (error) {
        return badRequest(error)
      }

      const result = await this.updatePost.update({ id: accountId, fields })
      return serverSuccess({ ok: result })
    } catch (e) {
      return serverError(e)
    }
  }
}

export namespace UpdatePostController {
  export type Request = {
    accountId: string
    title: string
    photos: string[]
    description: string

    status: boolean
    active: boolean

    views: number

    carBeingSold: PostModel.CarBeingSold
  }
}

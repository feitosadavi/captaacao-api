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
      const { clientFiles, id, data } = request // exclude id
      const error = this.validation.validate(data)
      if (error) return badRequest(error)
      const params = JSON.parse(data) as UpdatePostController.Data
      const fieldsToUpdate: any = { ...params }
      if (clientFiles) {
        fieldsToUpdate.photos = clientFiles
      }
      const result = await this.updatePost.update({ id: id, fields: fieldsToUpdate })
      return serverSuccess({ ok: result })
    } catch (e) {
      return serverError(e)
    }
  }
}

export namespace UpdatePostController {
  type ClientFiles = {
    clientFiles?: Array<{
      fileName: string
      buffer: Buffer
      mimeType: string
    }>
  }

  export type Data = {
    title: string
    photos: string[]
    description: string

    status: boolean
    active: boolean

    views: number

    carBeingSold: PostModel.CarBeingSold
  }

  export type Request = {
    accountId: string
    id: string
    data: string
  } & ClientFiles
}

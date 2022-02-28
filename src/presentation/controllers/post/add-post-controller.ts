import { AddPost } from '@/domain/usecases'
import { badRequest, noContent, serverError } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class AddPostController implements Controller<AddPostController.Request> {
  constructor (
    private readonly validation: Validation,
    private readonly addPost: AddPost
  ) {}

  async handle (request: AddPostController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(new Error())
      const {
        title,
        photos,
        description,
        postedBy,
        carBeingSold
      } = request

      const createdAt = new Date()
      const modifiedAt = new Date()
      createdAt.toLocaleString('pt-BR')
      modifiedAt.toLocaleString('pt-BR')

      await this.addPost.add({
        title,
        photos,
        description,
        createdAt,
        modifiedAt,
        postedBy,
        status: true,
        active: true,
        views: 0,
        carBeingSold
      })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace AddPostController {
  export type Request = Omit<AddPost.Params,
  'status' |
  'active' |
  'views' |
  'createdAt' |
  'modifiedAt'
  >
}

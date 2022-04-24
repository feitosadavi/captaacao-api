/* eslint-disable @typescript-eslint/indent */
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
      const { accountId, clientFiles, ...requestParams } = request

      const createdAt = new Date()
      const modifiedAt = new Date()
      createdAt.toLocaleString('pt-BR')
      modifiedAt.toLocaleString('pt-BR')

      await this.addPost.add({
        ...requestParams,
        photos: clientFiles,
        createdAt: new Date(),
        modifiedAt: new Date(),
        postedBy: accountId,
        status: true,
        active: true,
        views: 0
      })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace AddPostController {
  type ClientFiles = {
    clientFiles?: Array<{
      fileName: string
      buffer: Buffer
      mimeType: string
    }>
  }
  export type Request = Omit<AddPost.Params,
    'photos' |
  'status' |
  'active' |
  'views' |
  'postedBy' |
  'createdAt' |
  'modifiedAt'
    > & { accountId: string } & ClientFiles
}

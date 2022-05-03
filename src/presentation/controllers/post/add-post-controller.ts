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
      if (error) return badRequest(error)
      const { accountId, clientFiles, title, description, ...carBeingSold } = request

      const createdAt = new Date()
      const modifiedAt = new Date()
      createdAt.toLocaleString('pt-BR')
      modifiedAt.toLocaleString('pt-BR')
      const params = {
        title,
        description,
        photos: clientFiles,
        postedBy: accountId,
        status: true,
        active: true,
        views: 0,
        carBeingSold,
        createdAt: new Date(),
        modifiedAt: new Date()
      }

      await this.addPost.add(params)
      return noContent()
    } catch (error) {
      console.error(error)
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
    'modifiedAt' |
    'carBeingSold'
  > & { accountId: string } & ClientFiles & {
    price: number
    fipePrice: number

    brand: string
    model: string
    year: string
    color: string
    doors: number
    steering: string
    fuel: string

    carItems: string[] // airbag, alarme, etc
    kmTraveled: number

    licensePlate: string
    sold: boolean
    fastSale: boolean
  }
}

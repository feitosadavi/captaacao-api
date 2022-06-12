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
      const { accountId, data, clientFiles } = request
      const params = JSON.parse(data as unknown as any)

      const error = this.validation.validate(params)
      if (error) return badRequest(error)

      const { title, description, ...carBeingSold } = params
      const createdAt = new Date()
      const modifiedAt = new Date()
      createdAt.toLocaleString('pt-BR')
      modifiedAt.toLocaleString('pt-BR')
      await this.addPost.add({
        title: title,
        description: description,
        photos: clientFiles as any,
        postedBy: accountId,
        status: true,
        active: true,
        views: 0,
        carBeingSold: {
          ...carBeingSold,
          sold: false
        },
        createdAt: new Date(),
        modifiedAt: new Date()
      })
      return noContent()
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}

export namespace AddPostController {
  type Data = Omit<AddPost.Params,
  'status' |
  'active' |
  'views' |
  'photos' |
  'postedBy' |
  'createdAt' |
  'modifiedAt' |
  'carBeingSold'
    > & {
      price: number
      fipePrice: number

    brand: string
    model: string
    year: string
    color: string
    doors: number
    steering: string
    fuel: string

    carItems: string[]
    kmTraveled: number

    licensePlate: string
    fastSale: boolean
  }
  // eslint-disable-next-line @typescript-eslint/array-type
  export type Request = {
    data: Data
    accountId: string
    clientFiles?: Array<{
      fileName: string
      buffer: Buffer
      mimeType: string
    }>
  }
}

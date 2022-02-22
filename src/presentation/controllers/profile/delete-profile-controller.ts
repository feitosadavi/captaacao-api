import { DeleteProfile } from '@/domain/usecases'
import { serverError, serverSuccess } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class DeleteProfileController implements Controller<DeleteProfileController.Request> {
  constructor (
    private readonly deleteProfile: DeleteProfile
  ) { }

  async handle (request: DeleteProfileController.Request): Promise<HttpResponse> {
    try {
      const { id } = request
      const result = await this.deleteProfile.delete({ id })
      return serverSuccess(result)
    } catch (e) {
      return serverError(e)
    }
  }
}

export namespace DeleteProfileController {
  export type Request = {
    id: string
  }
}

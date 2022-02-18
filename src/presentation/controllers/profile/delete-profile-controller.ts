import { DeleteProfile } from '@/domain/usecases'
import { serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class DeleteProfileController implements Controller {
  constructor (
    private readonly deleteProfile: DeleteProfile
  ) { }

  async handle (httpRequest: HttpRequest<any, any, {id: string}>): Promise<HttpResponse> {
    try {
      const profileIdToDelete = httpRequest.params.id
      const result = await this.deleteProfile.delete({ id: profileIdToDelete })
      return serverSuccess(result)
    } catch (e) {
      return serverError(e)
    }
  }
}

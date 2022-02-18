import { LoadProfiles } from '@/domain/usecases'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoadProfilesController implements Controller {
  constructor (private readonly loadProfiles: LoadProfiles) { }
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const profiles = await this.loadProfiles.load()
      return profiles.length ? serverSuccess(profiles) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

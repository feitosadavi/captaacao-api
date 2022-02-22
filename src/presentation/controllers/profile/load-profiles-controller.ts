import { LoadProfiles } from '@/domain/usecases'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class LoadProfilesController implements Controller<LoadProfilesController.Request> {
  constructor (private readonly loadProfiles: LoadProfiles) { }
  async handle (request: LoadProfilesController.Request): Promise<HttpResponse> {
    try {
      const profiles = await this.loadProfiles.load()
      return profiles.length ? serverSuccess(profiles) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadProfilesController {
  export type Request = any
}

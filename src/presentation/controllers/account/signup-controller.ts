import { AddAccount, Authentication } from '@/domain/usecases'
import {
  badRequest,
  forbidden,
  serverError,
  serverSuccess
} from '@/presentation/helpers'
import { EmailInUseError } from '@/presentation/errors'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class SignUpController implements Controller<SignUpController.Request> {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) { }

  async handle (request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)

      const { clientFiles, ...requestParams } = request
      const params = clientFiles ? { ...requestParams, profilePhoto: clientFiles[0] } : requestParams

      const isValid = await this.addAccount.add(params)
      if (!isValid) return forbidden(new EmailInUseError())

      const authenticationModel = await this.authentication.auth({
        email: requestParams.email,
        password: requestParams.password
      })

      return serverSuccess(authenticationModel)
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}

export namespace SignUpController {
  type ClientFiles = {
    clientFiles?: Array<{
      fileName: string
      buffer: Buffer
      mimeType: string
    }>
  }
  export type Request = Omit<AddAccount.Params, 'profilePhoto'> & ClientFiles
}

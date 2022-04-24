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
      console.log(request.clientFiles)
      const {
        name,
        profiles,
        doc,
        birthDate,
        password,
        email,
        phone,
        cep,
        endereco,
        complemento,
        uf,
        cidade,
        bairro
      } = request
      const isValid = await this.addAccount.add({
        name,
        profiles,
        doc,
        profilePhoto: request?.clientFiles[0],
        birthDate,
        password,
        email,
        phone,
        cep,
        endereco,
        complemento,
        uf,
        cidade,
        bairro
      })
      if (!isValid) return forbidden(new EmailInUseError())
      const authenticationModel = await this.authentication.auth({
        email,
        password
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
    clientFiles?: [{
      fileName: string
      buffer: Buffer
      mimeType: string
    }]
  }
  export type Request = Omit<AddAccount.Params, 'profilePhoto'> & ClientFiles
}

import { InvalidParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols/validation'

export class OptionalFieldValidation implements Validation {
  constructor (private readonly options: string[]) { }

  validate (input: any): Error {
    const inputField = Object.keys(input)[0]
    if (!this.options.includes(inputField)) {
      return new InvalidParamError(inputField)
    }
  }
}

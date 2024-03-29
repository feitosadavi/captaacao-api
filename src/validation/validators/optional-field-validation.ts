import { InvalidParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols/validation'

// TRABALHE DA IDEIA DA VALIDAÇÃO DE SCHEMA!!!!

export class OptionalFieldValidation implements Validation {
  constructor (private readonly permittedFields: string[], private readonly permittedNestedFields?: string[]) { }

  validate (input: any): Error {
    const fields = Object.keys(input)
    for (const field of fields) {
      if (!this.permittedFields.includes(field)) {
        return new InvalidParamError(field)
      } else {
        const existentNestedKeys = Object.keys(input[field])
        const hasKeys = !!existentNestedKeys.length && typeof input[field] === 'object' && input[field] !== null
        if (this.permittedNestedFields?.length > 0 && hasKeys) {
          for (const key of existentNestedKeys) {
            if (!this.permittedNestedFields.includes(key)) {
              return new InvalidParamError(key)
            }
          }
        }
      }
    }
  }
}

// if (!this.permittedFields.includes(input[field])) {
//   return new InvalidParamError(field)
// }

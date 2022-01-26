import { InvalidParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols/validation'

// TRABALHE DA IDEIA DA VALIDAÇÃO DE SCHEMA!!!!

export class OptionalFieldValidation implements Validation {
  constructor (private readonly options: string[], private readonly nestedFields?: string[]) { }

  validate (input: any): Error {
    const fields = Object.keys(input)
    for (const field of fields) {
      if (!this.options.includes(field)) {
        return new InvalidParamError(field)
      } else {
        const hasKeys = !!Object.keys(input[field]).length
        if (this.nestedFields?.length > 0 && hasKeys) {
          const nestedKeys = Object.keys(input[field])
          console.log('this nestedFields: ', this.nestedFields)
          for (const key of nestedKeys) {
            console.log({ key })
            // console.log('obj key: ', Object.keys(input[field][key])[0])
            console.log(!this.nestedFields.includes(key))
            if (!this.nestedFields.includes(key)) {
              return new InvalidParamError(key)
            }
          }
        }
      }
    }
  }
}

// if (!this.options.includes(input[field])) {
//   return new InvalidParamError(field)
// }

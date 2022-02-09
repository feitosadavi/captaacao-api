import { SixDigitCodeError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols/validation'

export class SixDigitCodeValidation implements Validation {
  validate (input: any): Error {
    if (input.toString().length !== 6) {
      return new SixDigitCodeError()
    }
  }
}

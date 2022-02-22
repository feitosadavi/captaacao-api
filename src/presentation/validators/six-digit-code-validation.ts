import { SixDigitCodeError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'

export class SixDigitCodeValidation implements Validation {
  validate (input: {code: number}): Error {
    if (input.code.toString().length !== 6) {
      return new SixDigitCodeError()
    }
  }
}

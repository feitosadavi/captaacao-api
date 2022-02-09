import { SixDigitCodeError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'
import { SixDigitCodeValidation } from '@/presentation/validators'

type SutTypes = {
  sut: Validation
}
const makeSut = (): SutTypes => {
  const sut = new SixDigitCodeValidation()
  return {
    sut
  }
}
describe('SixDigitCodeValidation', () => {
  test('Should SixDigitCodeValidation returns SixDigitCodeValidation if validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate(1)
    expect(error).toEqual(new SixDigitCodeError())
  })

  test('Should SixDigitCodeValidation returns nothing if validation succeed', () => {
    const { sut } = makeSut()
    const error = sut.validate(123456)
    expect(error).toBeFalsy()
  })
})

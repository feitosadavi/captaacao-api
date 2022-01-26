import { InvalidParamError } from '@/presentation/errors'
import { OptionalFieldValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'

type SutTypes = {
  sut: Validation
}

const makeSut = (options: string[]): SutTypes => {
  const sut = new OptionalFieldValidation(options)
  return {
    sut
  }
}

describe('OptionalFieldValidation', () => {
  test('Should OptionalFieldValidation returns InvalidParamError if validation fails', () => {
    const options = ['field', 'other_field']
    const { sut } = makeSut(options)
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new InvalidParamError('name'))
  })

  test('Should OptionalFieldValidation returns nothing if validation succeed', () => {
    const options = ['field', 'other_field']
    const { sut } = makeSut(options)
    const error = sut.validate({ field: 'any_field' })
    expect(error).toBeFalsy()
  })
})

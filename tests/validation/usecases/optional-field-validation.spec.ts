import { InvalidParamError } from '@/presentation/errors'
import { OptionalFieldValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'

type SutTypes = {
  sut: Validation
}

const makeSut = (options: string[], nestedFields?: string[]): SutTypes => {
  const sut = new OptionalFieldValidation(options, nestedFields)
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

  test('Should OptionalFieldValidation returns InvalidParamError if validation with only nested params fails', () => {
    const options = ['person']
    const nestedOptions = ['nested_field']
    const { sut } = makeSut(options, nestedOptions)
    const error = sut.validate({ person: { name: 'any_name', adress: 'any_adress' } })
    expect(error).toEqual(new InvalidParamError('name'))
  })
})

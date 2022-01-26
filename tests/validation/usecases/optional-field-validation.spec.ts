import { InvalidParamError } from '@/presentation/errors'
import { OptionalFieldValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'

type SutTypes = {
  sut: Validation
}

const makeSut = (permittedFields: string[], permittedNestedFields?: string[]): SutTypes => {
  const sut = new OptionalFieldValidation(permittedFields, permittedNestedFields)
  return {
    sut
  }
}

describe('OptionalFieldValidation', () => {
  test('Should OptionalFieldValidation returns InvalidParamError if validation fails', () => {
    const permittedFields = ['field', 'other_field']
    const { sut } = makeSut(permittedFields)
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new InvalidParamError('name'))
  })

  test('Should OptionalFieldValidation returns nothing if validation succeed', () => {
    const permittedFields = ['field', 'other_field']
    const { sut } = makeSut(permittedFields)
    const error = sut.validate({ field: 'any_field' })
    expect(error).toBeFalsy()
  })

  test('Should OptionalFieldValidation returns InvalidParamError if validation with only nested params fails', () => {
    const permittedFields = ['person']
    const permittedNestedFields = ['nested_field']
    const { sut } = makeSut(permittedFields, permittedNestedFields)
    const error = sut.validate({ person: { name: 'any_name', adress: 'any_adress' } })
    expect(error).toEqual(new InvalidParamError('name'))
  })

  test('Should OptionalFieldValidation returns InvalidParamError if validation with only multiple nested params fails', () => {
    const permittedFields = ['person']
    const permittedNestedFields = ['nested_field']
    const { sut } = makeSut(permittedFields, permittedNestedFields)
    const error = sut.validate({ person: { nested_field: 'any_value', other_field: 'any_value' } })
    expect(error).toEqual(new InvalidParamError('other_field'))
  })

  test('Should OptionalFieldValidation returns nothing if validation with only multiple nested params succeed', () => {
    const permittedFields = ['person']
    const permittedNestedFields = ['nested_field', 'other_field']
    const { sut } = makeSut(permittedFields, permittedNestedFields)
    const error = sut.validate({ person: { nested_field: 'any_value', other_field: 'any_value' } })
    expect(error).toBeFalsy()
  })

  test('Should OptionalFieldValidation returns nothing if validation with only nested params succeed', () => {
    const permittedFields = ['field']
    const permittedNestedFields = ['nested_field', 'other_nested_field']
    const { sut } = makeSut(permittedFields, permittedNestedFields)
    const error = sut.validate({ field: { nested_field: 'any_value', other_nested_field: 'other_value' } })
    expect(error).toBeFalsy()
  })
})

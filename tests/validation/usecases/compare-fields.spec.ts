import { InvalidParamError } from '@/presentation/errors/invalid-param-error'
import { Validation } from '@/presentation/protocols/validation'
import { CompareFieldsValidation } from '@/validation/validators'

type SutTypes = {
  sut: Validation
}

const makeSut = (fieldName: string, fieldNameToCompare: string): SutTypes => {
  const sut = new CompareFieldsValidation(fieldName, fieldNameToCompare)
  return {
    sut
  }
}

describe('CompareFieldsValidation', () => {
  test('Should CompareFieldsValidation returns InvalidParamError if validation fails', () => {
    const { sut } = makeSut('field', 'fieldToCompare')
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'wrong_value' })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should CompareFieldsValidation returns nothing if validation succeed', () => {
    const { sut } = makeSut('field', 'fieldToCompare')
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'any_value' })
    expect(error).toBeFalsy()
  })
})

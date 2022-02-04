import { CodeMatchesValidation } from '@/presentation/validators/code-matches-validation'
import { CodeMatches } from '@/validation/protocols'

const makeSut = (): CodeMatches => new CodeMatchesValidation()

describe('ConfirmationCode Validation', () => {
  test('should return false if params were different', () => {
    const sut = makeSut()
    const matches = sut.matches({ first: 777777, second: 888888 })
    expect(matches).toBe(false)
  })
})

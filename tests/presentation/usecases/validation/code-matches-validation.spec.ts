import { CodeMatchesValidation } from '@/presentation/validators'
import { CodeMatches } from '@/validation/protocols'

const makeSut = (): CodeMatches => new CodeMatchesValidation()

describe('ConfirmationCode Validation', () => {
  test('should return false if params were different', () => {
    const sut = makeSut()
    const matches = sut.matches({ first: 777777, second: 888888 })
    expect(matches).toBe(false)
  })
  test('should return true if params were equal', () => {
    const sut = makeSut()
    const matches = sut.matches({ first: 999999, second: 999999 })
    expect(matches).toBe(true)
  })
})

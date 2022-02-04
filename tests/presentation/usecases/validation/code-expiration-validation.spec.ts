import MockDate from 'mockdate'
import { CodeExpirationValidation } from '@/presentation/validators'
import { CodeExpiration } from '@/validation/protocols'

const makeSut = (): CodeExpiration => new CodeExpirationValidation()

describe('CodeExpiration Validation', () => {
  beforeAll(() => {
    MockDate.set(new Date('2011-04-11T11:50:00'))
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('should return true if expiration date is minor than current date', () => {
    const sut = makeSut()
    const isExpired = sut.isExpired({ expiresAt: new Date('2011-04-11T11:45:00') })
    expect(isExpired).toBe(true)
  })
})

import { Validation } from '@/presentation/protocols/validation'
import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '@/validation/validators'
import { EmailValidator } from '@/validation/protocols/email-validator'
import { makePasswordRecoverValidation } from '@/main/factories'

jest.mock('@/validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
describe('PasswordRecover Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makePasswordRecoverValidation()
    const validations: Validation[] = []
    for (const field of ['email']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
  })
})

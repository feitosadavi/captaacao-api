import { Validation } from '@/presentation/protocols/validation'
import { RequiredFieldValidation, CompareFieldsValidation, EmailValidation, ValidationComposite } from '@/validation/validators'
import { EmailValidator } from '@/validation/protocols/email-validator'
import { makeSignUpValidation } from '@/main/factories'

// quando eu mocko um módulo, ele passa a não ter mais o comportamento default dele
jest.mock('@/validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
// aqui vamos garantir que o validation composite não irá deixar de injetar nenhuma validação que precisa ter
describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'doc', 'birthDate', 'phone', 'role']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
  })
})

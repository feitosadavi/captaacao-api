import { Validation } from '@/presentation/protocols/validation'
import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '@/validation/validators'
import { EmailValidator } from '@/validation/protocols/email-validator'
import { makeLoginValidation } from '@/main/factories'

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
describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
  })
})

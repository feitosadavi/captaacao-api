import { EmailValidatorAdapter } from '@/infra/validators'
import { Validation } from '@/presentation/protocols'
import { ValidationComposite, EmailValidation, RequiredFieldValidation } from '@/validation/validators'

export const makePasswordRecoverValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}

import { ValidationComposite, EmailValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { EmailValidatorAdapter } from '@/infra/validators'

export const makePasswordRecoverValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}

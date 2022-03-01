import { RequiredFieldValidation, CompareFieldsValidation, EmailValidation, ValidationComposite } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { EmailValidatorAdapter } from '@/infra/validators'

// este factory foi criado para que possamos testar apenas o validation de forma isolada
export const makeSignUpValidation = (): ValidationComposite => {
  // para cada campo que eu tiver, vou adicionar uma validação
  const validations: Validation[] = []
  for (const field of [
    'name',
    'email',
    'password',
    'doc',
    'birthDate',
    'phone',
    'profiles',
    'cep',
    'endereco',
    'complemento',
    'uf',
    'cidade',
    'bairro']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}

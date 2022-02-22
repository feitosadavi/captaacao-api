import { Validation } from '@/presentation/protocols/validation'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

// este factory foi criado para que possamos testar apenas o validation de forma isolada
export const makeUpdatePasswordValidation = (): ValidationComposite => {
  // para cada campo que eu tiver, vou adicionar uma validação
  const validations: Validation[] = []
  validations.push(new RequiredFieldValidation('password'))
  return new ValidationComposite(validations)
}

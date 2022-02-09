import { ValidationComposite } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { SixDigitCodeValidation } from '@/presentation/validators'

// este factory foi criado para que possamos testar apenas o validation de forma isolada
export const makeCheckCodeValidation = (): ValidationComposite => {
  // para cada campo que eu tiver, vou adicionar uma validação
  const validations: Validation[] = []
  validations.push(new SixDigitCodeValidation())
  return new ValidationComposite(validations)
}

import { Validation } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validators'

export const makeUpdatePostValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  return new ValidationComposite(validations)
}

import { Validation } from '@/presentation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

export const makeAddPostValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of [
    'title',
    'photos',
    'description'
  ]) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}

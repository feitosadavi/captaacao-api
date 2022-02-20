import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'

export const makeAddPostValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name',
    'price',
    'brand',
    'year',
    'color',
    'kmTraveled',
    'vehicleItems']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}

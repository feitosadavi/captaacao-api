import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { makeAddProfileValidation } from '@/main/factories'

// quando eu mocko um módulo, ele passa a não ter mais o comportamento default dele
jest.mock('@/validation/validators/validation-composite')

describe('AddProfileValidationFactory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddProfileValidation()
    const validations: Validation[] = []
    validations.push(new RequiredFieldValidation('name'))
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
  })
})

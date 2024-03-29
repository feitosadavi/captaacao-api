import { Validation } from '@/presentation/protocols/validation'
import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'
import { makeAddPostValidation } from '@/main/factories'

// quando eu mocko um módulo, ele passa a não ter mais o comportamento default dele
jest.mock('@/validation/validators/validation-composite')

describe('AddPost Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddPostValidation()
    const validations: Validation[] = []
    for (const field of [
      'title',
      'photos',
      'description'
    ]) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
  })
})

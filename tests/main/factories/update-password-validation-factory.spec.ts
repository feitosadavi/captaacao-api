import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { makeUpdatePasswordValidation } from '@/main/factories'

// quando eu mocko um módulo, ele passa a não ter mais o comportamento default dele
jest.mock('@/validation/validators/validation-composite')

// aqui vamos garantir que o validation composite não irá deixar de injetar nenhuma validação que precisa ter
describe('UpdatePasswordValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeUpdatePasswordValidation()
    const validations: Validation[] = []
    validations.push(new RequiredFieldValidation('password'))
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
  })
})

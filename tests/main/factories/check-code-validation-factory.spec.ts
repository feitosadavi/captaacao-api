import { Validation } from '@/presentation/protocols/validation'
import { SixDigitCodeValidation } from '@/presentation/validators'
import { makeCheckCodeValidation } from '@/main/factories'
import { ValidationComposite } from '@/validation/validators'

// quando eu mocko um módulo, ele passa a não ter mais o comportamento default dele
jest.mock('@/validation/validators/validation-composite')

// aqui vamos garantir que o validation composite não irá deixar de injetar nenhuma validação que precisa ter
describe('CheckCodeValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeCheckCodeValidation()
    const validations: Validation[] = []
    validations.push(new SixDigitCodeValidation())
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
  })
})

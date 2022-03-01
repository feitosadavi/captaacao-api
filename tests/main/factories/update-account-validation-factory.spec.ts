import { Validation } from '@/presentation/protocols/validation'
import { OptionalFieldValidation, ValidationComposite } from '@/validation/validators'
import { makeUpdateAccountValidationFactory } from '@/main/factories'

// quando eu mocko um módulo, ele passa a não ter mais o comportamento default dele
jest.mock('@/validation/validators/validation-composite')

// aqui vamos garantir que o validation composite não irá deixar de injetar nenhuma validação que precisa ter
describe('UpdateAccountValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeUpdateAccountValidationFactory()
    const validations: Validation[] = []
    const allowedFields = ['name',
      'profile',
      'profilePhoto',
      'doc',
      'birthDate',
      'password',
      'email',
      'phone',
      'profile',
      'adress'
    ]
    const adressOptions = [
      'cep',
      'endereco',
      'complemento',
      'uf',
      'cidade',
      'bairro'
    ]
    const notificationFields = ['message', 'createdAt', 'isSeen']
    const ratingFields = ['message', 'createdAt', 'status', 'rater']
    const allowedNestedFields = [...adressOptions, ...notificationFields, ...ratingFields]

    validations.push(new OptionalFieldValidation(allowedFields, allowedNestedFields))
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
  })
})

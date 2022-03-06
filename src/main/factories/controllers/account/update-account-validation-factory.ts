import { Validation } from '@/presentation/protocols/validation'
import { OptionalFieldValidation, ValidationComposite } from '@/validation/validators'

// este factory foi criado para que possamos testar apenas o validation de forma isolada
export const makeUpdateAccountValidationFactory = (): ValidationComposite => {
  // para cada campo que eu tiver, vou adicionar uma validação
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
  return new ValidationComposite(validations)
}

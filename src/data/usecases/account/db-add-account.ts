import { AddAccountRepository, Hasher, LoadAccountByEmailRepository } from '@/data/protocols'
import { AddAccount } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async add (params: AddAccount.Params): AddAccount.Result {
    const {
      cep,
      endereco,
      complemento,
      uf,
      cidade,
      bairro,
      ...otherParams
    } = params
    const adress = {
      cep,
      endereco,
      complemento,
      uf,
      cidade,
      bairro
    }
    const addParams = { adress, ...otherParams }
    const account = await this.loadAccountByEmailRepository.loadByEmail({ email: params.email })
    let isValid = false
    if (!account) {
      const hashedPassword = await this.hasher.hash(params.password)
      isValid = await this.addAccountRepository.addAccount({ ...addParams, password: hashedPassword })
    }
    return isValid
  }
}

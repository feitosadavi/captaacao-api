import { AddAccountRepository, Hasher, LoadAccountByEmailRepository } from '@/data/protocols'
import { UploadFile } from '@/data/protocols/gateways'
import { AddAccount } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly uploadFile: UploadFile,
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
      profilePhoto,
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
    const addParams = { ...otherParams, adress }
    const account = await this.loadAccountByEmailRepository.loadByEmail({ email: params.email })
    let isValid = false
    if (!account) {
      console.log(profilePhoto)
      await this.uploadFile.upload({ file: profilePhoto.buffer, fileName: profilePhoto.fileName })
      const hashedPassword = await this.hasher.hash(params.password)
      isValid = await this.addAccountRepository.addAccount({ ...addParams, profilePhoto: profilePhoto?.fileName, password: hashedPassword })
    }
    return isValid
  }
}

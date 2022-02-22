import { DeleteAccount } from '@/domain/usecases'
import { DeleteAccountRepository } from '@/data/protocols'

export class DbDeleteAccount implements DeleteAccount {
  constructor (
    private readonly deleteAccountRepository: DeleteAccountRepository
  ) { }

  async delete (params: DeleteAccount.Params): DeleteAccount.Result {
    const deleteResult = await this.deleteAccountRepository.deleteAccount(params)
    return deleteResult
  }
}

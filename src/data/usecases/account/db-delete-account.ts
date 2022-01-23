import { DeleteAccountRepository } from '@/data/protocols'
import { DeleteAccount } from '@/domain/usecases'

export class DbDeleteAccount implements DeleteAccount {
  constructor (
    private readonly deleteAccountRepository: DeleteAccountRepository
  ) { }

  async delete (id: string): Promise<boolean> {
    const deleteResult = await this.deleteAccountRepository.deleteAccount(id)
    return deleteResult
  }
}

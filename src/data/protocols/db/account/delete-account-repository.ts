export interface DeleteAccountRepository {
  deleteAccount(id: string): Promise<boolean>
}

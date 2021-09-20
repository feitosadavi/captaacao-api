export interface DeleteAccount {
  delete (id: string): Promise<boolean>
}

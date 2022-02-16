import { ProfileModel } from '@/domain/models'

export const mockProfileModel = (): ProfileModel => ({
  id: 'any_id',
  name: 'any_name',
  accounts: [
    'any_account_id',
    'other_account_id'
  ],
  createdAt: new Date(),
  modifiedAt: new Date()
})

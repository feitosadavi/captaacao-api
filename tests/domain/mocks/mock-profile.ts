import { ProfileModel } from '@/domain/models'
import { AddProfile } from '@/domain/usecases'

export const mockProfileParams = (): AddProfile.Params => ({
  name: 'any_name'
})

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

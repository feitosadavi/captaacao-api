import { ProfileModel } from '@/domain/models'
import { AddProfile } from '@/domain/usecases'

export const mockProfileParams = (): AddProfile.Params => ({
  name: 'any_name',
  createdBy: 'any_account_id',
  createdAt: new Date()
})

export const mockProfileModels = (): ProfileModel[] => ([
  {
    id: 'any_id',
    name: 'any_name',
    createdAt: new Date(),
    modifiedAt: new Date()
  }, {
    id: 'other_id',
    name: 'other_name',
    createdAt: new Date(),
    modifiedAt: new Date()
  }
])

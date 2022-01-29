import { AccountModel } from '@/domain/models'

export interface GeneratePassRecoverInfo {
  generate(): AccountModel.RecoverPassInfo
}

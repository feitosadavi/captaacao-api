import { GeneratePassRecoverInfo } from '@/data/protocols/others'
import { AccountModel } from '@/domain/models'
import { mockRecoverPassInfo } from '@tests/domain/mocks'

export const mockGeneratePassRecoverInfoStub = (): GeneratePassRecoverInfo => {
  class GeneratePassRecoverInfoStub implements GeneratePassRecoverInfo {
    generate (): AccountModel.RecoverPassInfo {
      return mockRecoverPassInfo()
    }
  }
  return new GeneratePassRecoverInfoStub()
}

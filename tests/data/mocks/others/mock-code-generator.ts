import { GeneratePassRecoverInfo } from '@/data/protocols/others'
import { AccountModel } from '@/domain/models'
import { mockAccountConfirmationCode } from '@tests/domain/mocks'

export const mockGeneratePassRecoverInfoStub = (): GeneratePassRecoverInfo => {
  class GeneratePassRecoverInfoStub implements GeneratePassRecoverInfo {
    generate (): AccountModel.Code {
      return mockAccountConfirmationCode()
    }
  }
  return new GeneratePassRecoverInfoStub()
}

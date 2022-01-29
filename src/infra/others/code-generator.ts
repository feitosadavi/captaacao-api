import { GeneratePassRecoverInfo } from '@/data/protocols/others'
import { AccountModel } from '@/domain/models'

export class CodeGenerator implements GeneratePassRecoverInfo {
  public code: number
  public createdAt: Date
  public expiresAt: Date

  generate (): AccountModel.RecoverPassInfo {
    const code = Math.floor(100000 + Math.random() * 900000)
    const createdAt = new Date()
    const expiresAt = new Date(createdAt)
    expiresAt.setMinutes(createdAt.getMinutes() + 5)

    this.code = code
    this.createdAt = createdAt
    this.expiresAt = expiresAt

    const recoverPassInfo = {
      code: this.code,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt
    }
    return recoverPassInfo
  }
}

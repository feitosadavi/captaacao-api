import { CodeExpiration } from '@/validation/protocols'

export class CodeExpirationValidation implements CodeExpiration {
  isExpired ({ expiresAt }: CodeExpiration.Params): CodeExpiration.Result {
    const isExpired = new Date() > expiresAt
    return isExpired
  }
}

import { CodeMatches, CodeExpiration } from '@/validation/protocols'

export const mockCodeMatches = (): CodeMatches => {
  class CodeMatchesStub implements CodeMatches {
    matches (params: CodeMatches.Params): CodeMatches.Result {
      return true
    }
  }
  return new CodeMatchesStub()
}

export const mockCodeExpiration = (): CodeExpiration => {
  class CodeExpirationStub implements CodeExpiration {
    isExpired (params: CodeExpiration.Params): CodeExpiration.Result {
      return false
    }
  }
  return new CodeExpirationStub()
}

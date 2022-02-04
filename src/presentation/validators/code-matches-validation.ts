import { CodeMatches } from '@/validation/protocols'

export class CodeMatchesValidation implements CodeMatches {
  matches ({ first, second }: CodeMatches.Params): CodeMatches.Result {
    return first === second
  }
}

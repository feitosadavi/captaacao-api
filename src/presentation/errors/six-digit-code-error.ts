export class SixDigitCodeError extends Error {
  constructor () {
    super('Code should have six digits')
    this.name = 'SixDigitCodeError'
  }
}

export class NoRecoverPassCodeError extends Error {
  constructor () {
    super('This account does not has recover password code')
    this.name = 'NoRecoverPassCodeError'
  }
}

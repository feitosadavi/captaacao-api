export class UnknownError extends Error {
  constructor (action: string) {
    super(`on ${action}`)
    this.name = 'UnknownError'
  }
}

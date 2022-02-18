export class NameInUseError extends Error {
  constructor () {
    super('The received name is alredy in use')
    this.name = 'NameInUseError'
  }
}

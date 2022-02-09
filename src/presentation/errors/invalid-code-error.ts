export class InvalidCodeError extends Error {
  constructor () {
    super('Inserted code is invalid')
    this.name = 'InvalidCode'
  }
}

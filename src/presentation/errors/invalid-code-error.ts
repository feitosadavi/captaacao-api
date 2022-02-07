export class InvalidCodeError extends Error {
  constructor () {
    super('Inserted code doesnt matches')
    this.name = 'InvalidCode'
  }
}

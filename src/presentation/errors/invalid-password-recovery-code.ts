export class InvalidPasswordRecoveryCodeError extends Error {
  constructor () {
    super('Inserted password recovery code doesnt matches')
    this.name = 'InvalidPasswordRecoveryCode'
  }
}

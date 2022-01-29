export class NotFoundAccountError extends Error {
  constructor () {
    super('Cant find any account with the inserted id')
    this.name = 'NotFoundAccountError'
  }
}

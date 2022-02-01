export interface SendEmailRepository {
  send (params: SendEmailRepository.Params): Promise<SendEmailRepository.Result>
}

export namespace SendEmailRepository {
  export type Params = {
    from: string
    to: string
    subject: string
    text: string
    html?: string
  }
  export type Result = boolean
}

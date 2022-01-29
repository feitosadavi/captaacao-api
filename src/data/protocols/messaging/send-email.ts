export interface SendEmail {
  send (params: SendEmail.Params): Promise<SendEmail.Result>
}

export namespace SendEmail {
  export type Params = {
    from: string
    to: string
    subject: string
    text: string
    html?: string
  }
  export type Result = boolean
}

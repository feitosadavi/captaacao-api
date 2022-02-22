export interface AddAccount {
  add (account: AddAccount.Params): AddAccount.Result
}

export namespace AddAccount {
  export type Params = {
    name: string
    profilePhoto: string
    profileType: string
    adress: {
      cep: string
      endereco: string
      complemento: string
      uf: string
      cidade: string
      bairro: string
    }
    doc: string
    birthDate: string
    password: string
    email: string
    phone: string
    role: string
  }

  export type Result = Promise<boolean>
}

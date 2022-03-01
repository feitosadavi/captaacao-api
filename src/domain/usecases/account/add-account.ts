export interface AddAccount {
  add (account: AddAccount.Params): AddAccount.Result
}

// its easier to validate non nested params
export namespace AddAccount {
  export type Params = {
    name: string
    profilePhoto: string
    profiles: string[]
    doc: string
    birthDate: string
    password: string
    email: string
    phone: string
    // Adress
    cep: string
    endereco: string
    complemento: string
    uf: string
    cidade: string
    bairro: string
  }

  export type Result = Promise<boolean>
}

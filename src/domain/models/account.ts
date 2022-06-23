import { PostModel } from './post'

export type AccountModel = {
  id: string
  name: string
  profiles: string[]
  profilePhoto?: string
  doc: string
  birthDate: string
  password: string
  email: string
  phone: string
  adress: AccountModel.Adress
  accessToken: string

  notifications?: AccountModel.Notification[]
  rating?: AccountModel.Rating[]

  favouritesList?: PostModel[]
  code?: AccountModel.Code
  canUseCookies?: boolean
  status?: boolean
  timeout?: number
  profileViews?: number
  online?: boolean
};

export namespace AccountModel {
  export type Adress = {
    cep: string
    endereco: string
    complemento: string
    uf: string
    cidade: string
    bairro: string
  }

  export type Notification = {
    message: string
    createdAt: Date
    isSeen: boolean
  }

  export type Rating = {
    message: string
    createdAt: Date
    status: boolean
    rater: AccountModel
  }

  export type Code = {
    number: number
    createdAt: Date
    expiresAt: Date
  }
}

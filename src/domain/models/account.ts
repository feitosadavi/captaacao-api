type Adress = {
  cep: string
  endereco: string
  complemento: string
  uf: string
  cidade: string
  bairro: string
}

type Notification = {
  message: string
  createdAt: Date
  isSeen: boolean
}

type Rating = {
  message: string
  createdAt: Date
  status: boolean
  rater: AccountModel
}

export type AccountModel = {
  id: string
  name: string
  profileType: string
  profilePhoto?: string
  doc: string
  birthDate: string
  password: string
  email: string
  phone: string
  role: string
  adress: Adress

  notifications?: Notification[]
  rating?: Rating[]

  canUseCookies: boolean
  status: boolean
  timeout: number
  profileViews: number
  online: boolean
};

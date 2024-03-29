import { AccountModel } from './account'

export type PostModel = {
  id: string
  title: string
  photos: string[]
  description: string

  createdAt: Date
  modifiedAt: Date
  postedBy: AccountModel
  status: boolean
  active: boolean

  views: number

  carBeingSold: PostModel.CarBeingSold
}

export namespace PostModel {
  export type CarBeingSold = {
    thumb: string // a link to a pic
    price: number
    fipePrice: number

    brand: string
    model: string
    year: number
    color: string
    doors: number
    steering: string
    fuel: string

    carItems: string[] // airbag, alarme, etc
    kmTraveled: number

    licensePlate: string
    sold: boolean
    fastSale: boolean
  }
}

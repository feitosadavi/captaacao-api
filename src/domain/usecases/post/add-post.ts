export interface AddPost {
  add (params: AddPost.Params): AddPost.Result
}

export namespace AddPost {
  export type Params = {
    name: string
    price: number
    brand: string
    year: string
    color: string
    vehicleItems: string[]
    kmTraveled: 100000
    addDate: Date
  }
  export type Result = Promise<void>
}

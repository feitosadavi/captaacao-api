import { CarModel } from '../../models/post'

export type AddCarParams = Omit<CarModel, 'id'>

export interface AddCar {
  add (carData: AddCarParams): Promise<void>
}

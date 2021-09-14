import { CarModel } from '../../models/car'

export type AddCarParams = Omit<CarModel, 'id'>

export interface AddCar {
  add (carData: AddCarParams): Promise<void>
}

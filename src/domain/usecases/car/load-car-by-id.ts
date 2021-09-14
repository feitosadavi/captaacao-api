import { CarModel } from '../../models/car'

export interface LoadCarById {
  loadById (id: string): Promise<CarModel>
}

import { CarModel } from '../../models/post'

export interface LoadCarById {
  loadById (id: string): Promise<CarModel>
}

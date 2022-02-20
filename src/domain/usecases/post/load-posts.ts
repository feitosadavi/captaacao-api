import { CarModel } from '@/domain/models/post'

export interface LoadCars {
  load (): Promise<CarModel[]>
}

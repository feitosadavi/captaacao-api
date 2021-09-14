import { CarModel } from '@/domain/models/car'

export interface LoadCars {
  load (): Promise<CarModel[]>
}

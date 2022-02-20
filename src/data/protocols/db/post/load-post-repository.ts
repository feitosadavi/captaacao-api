import { CarModel } from '@/domain/models/post'

export interface LoadCarsRepository {
  loadAll(): Promise<CarModel[]>
}

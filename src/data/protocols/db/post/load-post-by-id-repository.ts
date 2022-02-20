import { CarModel } from '@/domain/models/post'

export interface LoadCarByIdRepository {
  loadById(id: string): Promise<CarModel>
}

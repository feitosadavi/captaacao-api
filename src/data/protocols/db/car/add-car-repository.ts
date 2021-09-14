import { AddCarParams } from '@/domain/usecases/car/add-car'

export interface AddCarRepository {
  add (carData: AddCarParams): Promise<void>
}

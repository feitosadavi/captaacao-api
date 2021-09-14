import { AddCar, AddCarParams } from '@/domain/usecases/car/add-car'
import { AddCarRepository } from './db-add-car-protocols'

export class DbAddCar implements AddCar {
  constructor (
    private readonly addCarRepository: AddCarRepository
  ) {}

  async add (data: AddCarParams): Promise<void> {
    await this.addCarRepository.add(data)
  }
}

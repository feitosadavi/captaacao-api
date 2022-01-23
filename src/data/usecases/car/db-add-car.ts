import { AddCarRepository } from '@/data/protocols'
import { AddCar, AddCarParams } from '@/domain/usecases/car/add-car'

export class DbAddCar implements AddCar {
  constructor (
    private readonly addCarRepository: AddCarRepository
  ) {}

  async add (data: AddCarParams): Promise<void> {
    await this.addCarRepository.add(data)
  }
}
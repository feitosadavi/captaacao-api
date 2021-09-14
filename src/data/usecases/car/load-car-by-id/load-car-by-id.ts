import { LoadCarByIdRepository } from '@/data/protocols/db/car/load-car-by-id-repository'
import { CarModel } from '@/domain/models/car'
import { LoadCarById } from '@/domain/usecases/car/load-car-by-id'

export class DbLoadCarById implements LoadCarById {
  constructor (private readonly loadCarByIdRepository: LoadCarByIdRepository) { }

  async loadById (id: string): Promise<CarModel> {
    const car = await this.loadCarByIdRepository.loadById(id)
    return car
  }
}

import { LoadCarByIdRepository } from '@/data/protocols'
import { CarModel } from '@/domain/models/post'
import { LoadCarById } from '@/domain/usecases'

export class DbLoadCarById implements LoadCarById {
  constructor (private readonly loadCarByIdRepository: LoadCarByIdRepository) { }

  async loadById (id: string): Promise<CarModel> {
    const car = await this.loadCarByIdRepository.loadById(id)
    return car
  }
}

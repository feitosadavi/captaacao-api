import { LoadCarsRepository } from '@/data/protocols'
import { CarModel } from '@/domain/models'
import { LoadCars } from '@/domain/usecases'

export class DbLoadCars implements LoadCars {
  constructor (private readonly loadCarsRepository: LoadCarsRepository) { }

  async load (): Promise<CarModel[]> {
    const cars = await this.loadCarsRepository.loadAll()
    return cars
  }
}

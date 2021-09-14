import { CarModel, LoadCars, LoadCarsRepository } from './db-load-car-protocols'

export class DbLoadCars implements LoadCars {
  constructor (private readonly loadCarsRepository: LoadCarsRepository) { }

  async load (): Promise<CarModel[]> {
    const cars = await this.loadCarsRepository.loadAll()
    return cars
  }
}

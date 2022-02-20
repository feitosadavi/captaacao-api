import { AddCarRepository, LoadCarByIdRepository, LoadCarsRepository } from '@/data/protocols'
import { CarModel } from '@/domain/models/post'
import { AddCarParams } from '@/domain/usecases'
import { ObjectID } from 'mongodb'
import { MongoHelper } from './mongo-helper'

export class CarMongoRepository implements AddCarRepository, LoadCarsRepository, LoadCarByIdRepository {
  async add (carData: AddCarParams): Promise<void> {
    const carsCollection = await MongoHelper.getCollection('cars')
    await carsCollection.insertOne(carData)
  }

  async loadAll (): Promise<CarModel[]> {
    const carsCollection = await MongoHelper.getCollection('cars')
    const cars = await carsCollection.find().toArray()
    return cars && MongoHelper.mapCollection(cars)
  }

  async loadById (id: string): Promise<CarModel> {
    const carsCollection = await MongoHelper.getCollection('cars')
    const car = await carsCollection.findOne({ _id: new ObjectID(id) })
    return car && MongoHelper.map(car)
  }
}

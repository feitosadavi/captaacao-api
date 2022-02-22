import MockDate from 'mockdate'

import { CodeGenerator } from '@/infra/others'

const makeSut = (): CodeGenerator => {
  const sut = new CodeGenerator()
  return sut
}

describe('CodeGenerator', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })

  test('Should code be number', () => {
    const sut = makeSut()
    sut.generate()
    expect(Number.isInteger(sut.code)).toBe(true)
  })
  test('Should code have 6 digits', () => {
    const sut = makeSut()
    sut.generate()
    expect(sut.code.toString()).toHaveLength(6)
  })
  test('Should createdAt be current Date', () => {
    const sut = makeSut()
    sut.generate()
    expect(sut.createdAt).toEqual(new Date())
  })
  test('Should expiresAt be 5 min after current Date', () => {
    const sut = makeSut()
    sut.generate()
    const expiresAt = sut.createdAt
    expiresAt.setMinutes(expiresAt.getMinutes() + 5)
    expect(sut.createdAt).toEqual(expiresAt)
  })
})

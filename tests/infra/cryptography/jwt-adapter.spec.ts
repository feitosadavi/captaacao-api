import jwt from 'jsonwebtoken'

import { JwtAdapter } from '@/infra/cryptography'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise <string> {
    return Promise.resolve('any_access_token')
  },
  async verify (): Promise <string> {
    return Promise.resolve('any_value')
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('JWT Adapter', () => {
  describe('sign()', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    test('Should return a token if sign succeeds', async () => {
      const sut = makeSut()
      const token = await sut.encrypt('any_id')
      expect(token).toBe('any_access_token')
    })

    test('Should throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('Should call verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_access_token')
      expect(verifySpy).toHaveBeenCalledWith('any_access_token', 'secret')
    })

    test('Should return a value on verify success', async () => {
      const sut = makeSut()
      const value = await sut.decrypt('any_access_token')
      expect(value).toBe('any_value')
    })

    test('Should throw if verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.decrypt('any_access_token')
      await expect(promise).rejects.toThrow()
    })
  })
})

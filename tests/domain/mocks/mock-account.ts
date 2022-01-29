import { AddAccount } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'

export const mockAccountParams = (): AddAccount.Params => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  doc: 'cpf_or_cnpj',
  birthDate: '00/00/0000',
  phone: 'any_phone',
  role: 'any_role',
  profileType: '1',
  profilePhoto: 'any_photo_link',
  adress: {
    cep: 'any_cep',
    endereco: 'any_endereco',
    complemento: 'any_complemento',
    uf: 'any_uf',
    cidade: 'any_cidade',
    bairro: 'any_bairro'
  }

})

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  birthDate: '00/00/0000',
  phone: '9999999999999',
  role: 'any_role',
  profileType: '1',
  profilePhoto: 'any_photo_link',
  doc: 'cpf_or_cnpj',

  adress: {
    cep: 'any_cep',
    endereco: 'any_endereco',
    complemento: 'any_complemento',
    uf: 'any_uf',
    cidade: 'any_cidade',
    bairro: 'any_bairro'
  },

  notifications: [{
    message: 'any_message',
    createdAt: new Date(),
    isSeen: false
  }],
  rating: [{
    message: 'any_message',
    createdAt: new Date(),
    status: true,
    rater: {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password',
      birthDate: '00/00/0000',
      phone: '9999999999999',
      role: 'any_role',
      profileType: '1',
      profilePhoto: 'any_photo_link',
      doc: 'cpf_or_cnpj',
      adress: {
        cep: 'any_cep',
        endereco: 'any_endereco',
        complemento: 'any_complemento',
        uf: 'any_uf',
        cidade: 'any_cidade',
        bairro: 'any_bairro'
      },
      notifications: [{
        message: 'any_message',
        createdAt: new Date(),
        isSeen: false
      }],
      canUseCookies: true,
      status: true,
      timeout: 0,
      profileViews: 0,
      online: true
    }
  }],

  canUseCookies: true,
  status: true,
  timeout: 0,
  profileViews: 0,
  online: true
})

export const mockRecoverPassInfo = (): AccountModel.RecoverPassInfo => ({
  code: 156987,
  createdAt: new Date('2011-04-11T11:50:00'),
  expiresAt: new Date('2011-04-11T11:55:00')
})

export const mockAccountsModel = (): AccountModel[] => ([
  mockAccountModel(),
  mockAccountModel()
])

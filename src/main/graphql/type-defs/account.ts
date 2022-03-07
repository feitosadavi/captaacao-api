import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    login (email: String!, password: String!): LoginAndSignupResult!
    accounts: [Account]
    account (id: String!): Account
  }

  extend type Mutation {
    signUp (
      name: String!
      password: String!
      passwordConfirmation: String!
      profiles: [String!]!
      profilePhoto: String
      doc: String!
      birthDate: String!
      email: String!
      phone: String!

      # Adress
      cep: String!
      endereco: String!
      complemento: String!
      uf: String!
      cidade: String!
      bairro: String!
    ): LoginAndSignupResult!
    updateAccount (
      name: String
      profilePhoto: String
      email: String
      phone: String

      # Adress
      cep: String
      endereco: String
      complemento: String
      uf: String
      cidade: String
      bairro: String
    ): UpdateResult! @auth
    deleteAccount (id: String!): DeleteResult! @auth
  }


  type Account {
    id: ID
    name: String
    profiles: [String]
    profilePhoto: String
    doc: String
    birthDate: String
    email: String
    phone: String
    adress: Adress

    accessToken: String
    code: Code
    canUseCookies: Boolean
    status: Boolean
    timeout: Int
    profileViews: Int
    online: Boolean
  }

  type Adress {
    cep: String
    endereco: String
    complemento: String
    uf: String
    cidade: String
    bairro: String
  }

  type Code {
    number: Int
    createdAt: DateTime
    expiresAt: DateTime
  }

  type LoginAndSignupResult {
    accessToken: String!
    name: String!
  }
  type UpdateResult {
    ok: Boolean!
  }
  type DeleteResult {
    result: Boolean!
  }
`

import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    login (email: String!, password: String!): LoginAndSignupResult!
    accounts: [Account!]!
  }

  extend type Mutation {
    signUp (
      name: String!
      password: String!
      passwordConfirmation: String!
      profiles: [String!]!
      profilePhoto: String!
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
`

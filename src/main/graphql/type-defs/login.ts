import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    login (email: String!, password: String!): Account!
  }

  extend type Mutation {
    signUp (
      name: String!
      password: String!
      passwordConfirmation: String!
      profileType: String!
      profilePhoto: String!
      doc: String!
      birthDate: String!
      email: String!
      phone: String!
      role: String!

      # Adress
      cep: String!
      endereco: String!
      complemento: String!
      uf: String!
      cidade: String!
      bairro: String!
    ): Account!
  }

  type Account {
    accessToken: String!
    name: String!
  }

  # type Account {
  #   id: String
  #   name: String
  #   profileType: String
  #   profilePhoto: String
  #   doc: String
  #   birthDate: String
  #   email: String
  #   phone: String
  #   role: String
  #   adress: Adress

  #   accessToken: String
  #   code: Code
  #   canUseCookies: Boolean
  #   status: Boolean
  #   timeout: Int
  #   profileViews: Int
  #   online: Boolean
  # }

  # type Adress {
  #   cep: String
  #   endereco: String
  #   complemento: String
  #   uf: String
  #   cidade: String
  #   bairro: String
  # }

  # type Code {
  #   number: Int
  #   createdAt: DateTime
  #   expiresAt: DateTime
  # }
`

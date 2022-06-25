import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    login (email: String!, password: String!): Account!
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
    ): Account!
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
    addFavouritePost(favouritePostId: String!): UpdateResult @auth
    removeFavouritePost(favouritePostId: String!): UpdateResult @auth
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

    favouritesList: [Post]
    accessToken: String
    code: Code
    canUseCookies: Boolean
    status: Boolean
    timeout: Int
    profileViews: Int
    online: Boolean
  }

  type Post {
    id: String!
    title: String!
    photos: [String!]
    description: String!
    postedBy: Account!

    carBeingSold: Car

    createdAt: DateTime
    modifiedAt: DateTime
    status: Boolean
    active: Boolean
  }

  type Car {
    thumb: String!
    price: Float!
    fipePrice: Int!
    brand: String!
    model: String!
    fuel: String!
    year: String!
    color: String!
    doors: Int!
    steering: String!
    carItems: [String]!
    kmTraveled: Int!
    licensePlate: String!
    sold: Boolean!
    fastSale: Boolean
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

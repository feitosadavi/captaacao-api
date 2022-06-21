import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    posts(
      loadFilterOptions: Boolean
      search: String,
      skip: Int,
      limit: Int,
      count: Boolean,
      postedBy: String,
      color: [String!]
      brand: [String!]
      year: [String!]
      steering: [String!]
      fuel: [String!]
      doors: [Int!]
    ) : PostsResult
    post (id: String!): Post
  }

  type PostsResult {
    posts: [Post!]
    filterOptions: FilterOptions
  }

  type FilterOptions {
    brand: [String]!
    model: [String]!
    fuel: [String]!
    year: [String]!
    color: [String]!
    doors: [Int]!
    steering: [String]!
  }

  extend type Mutation {
    addPost (
      title: String!
      photos: [String!]
      description: String!
      carBeingSold: CarBeingSold
    ): Boolean @auth
    deletePost (id: String!): DeletionResult! @auth
  }

  type DeletionResult {
    result: Boolean
  }

  input CarBeingSold {
    thumb: String!
    price: Float!
    fipePrice: Float!

    brand: String!
    model: String!
    year: String!
    color: String!
    doors: Int!
    steering: String!

    carItems: [String]!
    kmTraveled: Int!

    licensePlate: String!
    sold: Boolean!
    fastSale: Boolean!
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
`

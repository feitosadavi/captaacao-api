import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    posts(
      loadFilterOptions: Boolean
      search: String,
      skip: Int,
      postedBy: String,
      color: [String!]
      brand: [String!]
      year: [String!]
      steering: [String!]
      fuel: [String!]
      doors: [Int!]
    ) : PostsResult!
    post (id: String!): Post
  }

  type PostsResult {
    posts: [Post!]
    filterOptions: FilterOptions!
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
    price: Int!
    fipePrice: Int!

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

    carBeingSold: Car

    createdAt: DateTime
    modifiedAt: DateTime
    postedBy: String
    status: Boolean
    active: Boolean
  }

  type Car {
    thumb: String!
    price: Int!
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

import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    profiles: [Profile!]
  }

  type Profile {
    id: String!
    name: String!
    createdAt: DateTime!
    modifiedAt: DateTime!
  }
`

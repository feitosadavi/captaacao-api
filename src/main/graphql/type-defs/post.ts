import { gql } from 'apollo-server-express'

export default gql`
  extend type Mutation {
    delete (id: String!): DeletionResult! @auth
  }

  type DeletionResult {
    result: Boolean
  }
`

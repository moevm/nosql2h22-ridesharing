import { buildSchema } from "graphql/utilities";

export const schema = buildSchema(`
  type User {
    id: ID!
    username: String
    password: String
    rides: [Ride]
  }
  type Ride {
    id: ID
    date: String
    participants: [User!]
  }
  input UserInput {
    id: ID
    username: String!
    password: String!
  }
  input RideInput {
    id: ID!
    date: String!
  }
  
  type Query {
    getAllUsers: [User]
    getUser(id: ID): User
  }
  
  type Mutation {
    createUser(input: UserInput): User
  }
  
`);

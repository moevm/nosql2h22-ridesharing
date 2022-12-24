import { buildSchema } from "graphql/utilities";

export const schema = buildSchema(`
  type User {
    id: ID!
    username: String
    password: String
    isAuthorized: Boolean
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
  input LoginUserInput {
    username: String!
    password: String!
  }
  input LogoutUserInput {
    username: String!
  }
  type Query {
    getAllUsers: [User]
    getUser(id: ID): User
  }
  
  type Mutation {
    createUser(input: UserInput): User
    loginUser(input: LoginUserInput): User
    logoutUser(input: LogoutUserInput): Boolean 
  }
  
`);

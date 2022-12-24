import { buildSchema } from "graphql/utilities";

export const schema = buildSchema(`
  type User {
    id: ID!
    username: String
    password: String
    isAuthorized: Boolean
    isAdmin: Boolean
    rides: [Ride]
  }
  type Ride {
    id: ID
    date: String
    participants: [User!]
  }
  type ReadError {
    errorCode: String
    errorMessage: String!
  }
  
  type UserReadResponse {
   user: User
   error: ReadError
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
    getUser(username: String): UserReadResponse
  }
  
  type Mutation {
    createUser(input: UserInput): UserReadResponse
    loginUser(input: LoginUserInput): User
    logoutUser(input: LogoutUserInput): Boolean 
  }
  
`);

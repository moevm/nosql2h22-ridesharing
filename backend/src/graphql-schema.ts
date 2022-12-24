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
  
  type Relation {
    isDriver: Boolean
    isFuture: Boolean
    isSure: Boolean
  }
  
  type Ride {
    id: ID
    title: String
    date: String
    from: String
    to: String
    price: Int
    maxPassengers: Int
    statusHistory: [String]
  }
  type ReadError {
    errorCode: String
    errorMessage: String!
  }
  
  type UserReadResponse {
   user: User
   error: ReadError
  }
  
  type UserRidesReadResponse {
   ride: Ride
   relation: Relation
  }
  
  input UserInput {
    id: ID
    username: String!
    password: String!
  }
  input RideInput {
    date: String
    title: String
    from: String
    to: String
    price: Int
    maxPassengers: Int
    username: String
  }
  input LoginUserInput {
    username: String!
    password: String!
  }
  input LogoutUserInput {
    username: String!
  }
  type Query {
    getAllUsers(pagenumber: Int): [User]
    getAllRides(pagenumber: Int): [Ride]
    getUserRides(username: String, pagenumber: Int) : [UserRidesReadResponse]
    getUser(username: String): UserReadResponse
  }
  
  type Mutation {
    createUser(input: UserInput): UserReadResponse
    createRide(input: RideInput): Boolean
    loginUser(input: LoginUserInput): User
    logoutUser(input: LogoutUserInput): Boolean 
  }
  
`);

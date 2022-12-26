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
  
  type RideReadResponse {
   ride: Ride
   relation: Relation
  }
  
  type UserRidesReadResponse {
   ride: Ride
   relation: Relation
   count: Int
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
  
  input RideDeleteInput {
    id: ID
  }
  
   input markRideAsResolvedInput {
    id: ID
  }
  
  input RideInvitationInput {
    rideId: ID
    userId: ID
  }
  
  input RideAcceptInvitationInput {
    rideId: ID
    userId: ID
  }
  
  type Query {
    getAllUsers(pagenumber: Int): [User]
    getAllUsersCount: Int
    getAllRides(pagenumber: Int): [Ride]
    getAllRidesCount: Int
    getUserRides(username: String, pagenumber: Int) : [UserRidesReadResponse]
    getUserPassedRides(username: String, pagenumber: Int) : [UserRidesReadResponse]
    getUserInvitations(username: String, pagenumber: Int) : [UserRidesReadResponse]
    getUser(username: String): UserReadResponse
    getRide(id: ID, username: String): RideReadResponse
    getAllUsersInRide(id: ID): [User]
  }
  
  type Mutation {
    createUser(input: UserInput): UserReadResponse
    createRide(input: RideInput): Boolean
    loginUser(input: LoginUserInput): User
    logoutUser(input: LogoutUserInput): Boolean 
    deleteRide(input: RideDeleteInput): Boolean 
    markRideAsResolved(input: markRideAsResolvedInput): Boolean 
    sendRideInvitation(input: RideInvitationInput): Boolean 
    acceptInvitation(input: RideAcceptInvitationInput): Boolean 
  }
  
`);

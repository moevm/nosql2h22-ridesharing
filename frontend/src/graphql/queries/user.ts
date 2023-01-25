import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
  query getAllUsers($pagenumber: Int, $query: String) {
    getAllUsers(pagenumber: $pagenumber, query: $query) {
      id
      username
      password
    }
  }
`;

export const GET_ALL_USERS_IN_RIDE = gql`
  query getAllUsersInRide($id: ID) {
    getAllUsersInRide(id: $id) {
      id
      username
    }
  }
`;

export const GET_ALL_USERS_COUNT = gql`
  query getAllUsersCount($query: String) {
    getAllUsersCount(query: $query)
  }
`;

export const GET_ALL_RIDES_COUNT = gql`
  query getAllRidesCount($query: String) {
    getAllRidesCount(query: $query)
  }
`;

export const GET_USER = gql`
  query getUser($username: String) {
    getUser(username: $username) {
      id
      username
      errorMessage
    }
  }
`;

export const GET_ALL_RIDES = gql`
  query getAllRides($pagenumber: Int, $query: String) {
    getAllRides(pagenumber: $pagenumber, query: $query) {
      title
      date
      from
      to
      price
      maxPassengers
      statusHistory
    }
  }
`;

export const GET_USER_RIDES = gql`
  query getUserRides($username: String, $pagenumber: Int) {
    getUserRides(username: $username, pagenumber: $pagenumber) {
      ride {
        id
        title
        date
        from
        to
        price
        maxPassengers
        statusHistory
      }
      relation {
        isDriver
        isFuture
        isSure
      }
      count
    }
  }
`;

export const GET_USER_PASSED_RIDES = gql`
  query getUserPassedRides($username: String, $pagenumber: Int) {
    getUserPassedRides(username: $username, pagenumber: $pagenumber) {
      ride {
        id
        title
        date
        from
        to
        price
        maxPassengers
        statusHistory
      }
      relation {
        isDriver
        isFuture
        isSure
      }
      count
    }
  }
`;

/*export const GET_USER_PROPOSED_RIDES_COUNT = gql`
  query getUserProposedRidesCount($username: String) {
    getUserProposedRidesCount($username: String)
  }
`;*/

export const GET_USER_PROPOSED_RIDES = gql`
  query getUserProposedRides($username: String, $pagenumber: Int) {
    getUserProposedRides(username: $username, pagenumber: $pagenumber) {
      ride {
        id
        title
        date
        from
        to
        price
        maxPassengers
        statusHistory
      }
      count
    }
  }
`;

export const GET_USER_INVITED_RIDES = gql`
  query getUserInvitations($username: String, $pagenumber: Int) {
    getUserInvitations(username: $username, pagenumber: $pagenumber) {
      ride {
        id
        title
        date
        from
        to
        price
        maxPassengers
        statusHistory
      }
      relation {
        isDriver
        isFuture
        isSure
      }
      count
    }
  }
`;

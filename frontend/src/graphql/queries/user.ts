import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
  query getAllUsers($pagenumber: Int) {
    getAllUsers(pagenumber: $pagenumber) {
      id
      username
      password
    }
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
  query getAllRides($pagenumber: Int) {
    getAllRides(pagenumber: $pagenumber) {
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
    }
  }
`;

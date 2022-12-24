import {gql} from '@apollo/client';

export const GET_ALL_USERS = gql`
  query {
      getAllUsers {
          id, username, password
      }
  }
  `

export const GET_USER = gql`
    query getUser($username: String) {
        getUser(username :$username) {
            id, username, errorMessage
        }
    }
`
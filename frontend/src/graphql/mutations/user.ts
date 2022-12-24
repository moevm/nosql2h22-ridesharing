import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation createUser($input: UserInput) {
    createUser(input: $input) {
      user {
        username
        id
      }
      error {
        errorMessage
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($input: LoginUserInput) {
    loginUser(input: $input) {
      username
      id
      isAuthorized
      isAdmin
    }
  }
`;

export const LOGOUT_USER = gql`
  mutation logoutUser($input: LogoutUserInput) {
    logoutUser(input: $input)
  }
`;

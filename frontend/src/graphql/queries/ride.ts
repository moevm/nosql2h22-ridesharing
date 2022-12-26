import { gql } from "@apollo/client";

export const GET_RIDE = gql`
  query getRide($id: ID, $username: String) {
    getRide(id: $id, username: $username) {
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

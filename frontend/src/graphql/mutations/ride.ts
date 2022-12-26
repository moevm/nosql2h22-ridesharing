import { gql } from "@apollo/client";

export const CREATE_RIDE = gql`
    mutation createRide($input: RideInput) {
        createRide(input: $input)
    }
`;

export const DELETE_RIDE = gql`
  mutation deleteRide($input: RideDeleteInput) {
      deleteRide(input: $input)
  }
`;

export const RESOLVE_RIDE = gql`
    mutation markRideAsResolved($input: markRideAsResolvedInput) {
        markRideAsResolved(input: $input)
    }
`;
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

export const SEND_RIDE_INVITATION = gql`
    mutation sendRideInvitation($input: RideInvitationInput) {
        sendRideInvitation(input: $input)
    }
`;

export const RESOLVE_RIDE = gql`
    mutation markRideAsResolved($input: markRideAsResolvedInput) {
        markRideAsResolved(input: $input)
    }
`;

export const ACCEPT_INVITE = gql`
    mutation acceptInvitation($input: RideAcceptInvitationInput) {
        acceptInvitation(input: $input)
    }
`;

export const ADD_PROPOSED_RIDE = gql`
    mutation addProposedRide($input: RideAddProposedInput) {
        addProposedRide(input: $input)
    }
`;
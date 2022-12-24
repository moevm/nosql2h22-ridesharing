import { gql } from "@apollo/client";

export const CREATE_RIDE = gql`
    mutation createRide($input: RideInput) {
        createRide(input: $input)
    }
`;
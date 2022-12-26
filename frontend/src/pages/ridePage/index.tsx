import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_RIDE } from "../../graphql/queries/ride";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../root";
import { TRideWithRelation } from "../../definitions";

export const RidePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);

  const [ride, setRide] = useState<TRideWithRelation>({
    date: "",
    from: "",
    id: "",
    isDriver: false,
    isFuture: false,
    isSure: false,
    maxPassengers: 0,
    price: 0,
    statusHistory: [],
    title: "",
    to: "",
  });

  useEffect(() => {
    if (!currentUser.isAuthorized) {
      navigate("/auth");
    }
  });

  const { data, loading, error } = useQuery(GET_RIDE, {
    variables: {
      username: currentUser.username,
      id,
    },
  });

  useEffect(() => {
    if (!loading && data) {
      // @ts-ignore
      setRide({ ...data.getRide.ride, ...data.getRide.relation });
    }
  }, [loading, data]);

  return <>
    {ride.title}
    {ride.from}
  </>;
};

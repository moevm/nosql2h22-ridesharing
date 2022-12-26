import { Pagination } from "@mui/material";
import {
  MAX_PAGE_SIZE,
  TRelation,
  TRide,
  TRideWithRelation,
  TUser,
} from "../../definitions";
import { DocumentNode, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Table } from "@gravity-ui/uikit";
import { RideStatusHistory } from "../rideStatusHistory";
import { useNavigate } from "react-router-dom";

export const RidesTable = (props: {
  graphQlMethod: DocumentNode;
  extractMethod: string;
  currentUser: TUser;
}) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(MAX_PAGE_SIZE);

  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery(props.graphQlMethod, {
    variables: {
      pagenumber: pageNumber,
      username: props.currentUser.username,
    },
  });

  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && data) {
      console.log(data);

      if (!data[props.extractMethod].length) {
        setTableData([]);
        return;
      }

      const rides: TRideWithRelation[] = data[props.extractMethod].map(
        ({ ride, relation }: { ride: TRide; relation: TRelation }) => ({
          ...ride,
          ...relation,
        })
      );

      setTableData(rides);

      const count = Math.floor(data.getUserRides[0]?.count / MAX_PAGE_SIZE) + 1;

      setPageCount(count ? count : pageCount);
    }
  }, [data]);

  return (
    <>
      <Table
        className={"ridesharing-table"}
        onRowClick={(event) => {
          console.log(event);
          navigate(`/ride/${event.id}`)
        }}
        columns={[
          {
            id: "date",
            name: "Date",
          },
          {
            id: "title",
            name: "Title",
          },
          {
            id: "from",
            name: "From",
          },
          {
            id: "to",
            name: "To",
          },
          {
            id: "price",
            name: "Price",
          },
          {
            id: "isDriver",
            name: "I am driver",
            template: (item) => {
              return item.isDriver ? "Yes" : "No";
            },
          },
          {
            id: "id",
            name: "",
            template: (item) => {
              return <RideStatusHistory ride={item} />;
            },
          },
        ]}
        data={tableData}
      />
      <Pagination
        count={pageCount}
        page={pageNumber}
        color="primary"
        onChange={(event, page) => {
          setPageNumber(page);
          refetch({ pagenumber: page });
        }}
      />
    </>
  );
};

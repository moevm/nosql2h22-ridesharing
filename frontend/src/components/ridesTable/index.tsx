import { Pagination } from "@mui/material";
import {
  MAX_PAGE_SIZE,
  TableWithAction,
  TRelation,
  TRide,
  TRideWithRelation,
  TUser,
} from "../../definitions";
import { DocumentNode, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ACCEPT_INVITE,
  DELETE_RIDE,
  RESOLVE_RIDE,
} from "../../graphql/mutations/ride";
import { TableActionConfig, useToaster } from "@gravity-ui/uikit";
import { ProfilePageContext } from "../../pages/profilePage";

export const RidesTable = (props: {
  graphQlMethod: DocumentNode;
  extractMethod: string;
  currentUser: TUser;
  withActions: boolean;
}) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(MAX_PAGE_SIZE);

  const { shouldUpdate, setShouldUpdate } = useContext(ProfilePageContext);

  const { add } = useToaster();

  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery(props.graphQlMethod, {
    variables: {
      pagenumber: pageNumber,
      username: props.currentUser.username,
    },
  });

  const [deleteRide] = useMutation(DELETE_RIDE);
  const [resolveRide] = useMutation(RESOLVE_RIDE);
  const [acceptInvite] = useMutation(ACCEPT_INVITE);

  const acceptInviteCb = (rideId: string) => {
    acceptInvite({
      variables: {
        input: {
          rideId,
          userId: props.currentUser.id,
        },
      },
    }).then((response) => {
      refetch({
        pagenumber: pageNumber,
        username: props.currentUser.username,
      });

      setShouldUpdate(true);

      add({
        name: "Done",
        title: "Invite accepted",
        type: "success",
        allowAutoHiding: true,
        timeout: 5000,
      });
    });
  };

  const deleteRideCb = (rideId: string) => {
    deleteRide({
      variables: {
        input: {
          id: rideId,
        },
      },
    }).then((response) => {
      refetch({
        pagenumber: pageNumber,
        username: props.currentUser.username,
      });

      setShouldUpdate(true);

      add({
        name: "Done",
        title: "Ride deleted",
        type: "success",
        allowAutoHiding: true,
        timeout: 5000,
      });
    });
  };

  useEffect(() => {
    setShouldUpdate(false);
  });

  useEffect(() => {
    refetch({
      pagenumber: pageNumber,
      username: props.currentUser.username,
    });
  }, [setShouldUpdate]);

  const resolveRideCb = (rideId: string) => {
    resolveRide({
      variables: {
        input: {
          id: rideId,
        },
      },
    }).then((response) => {
      refetch({
        pagenumber: pageNumber,
        username: props.currentUser.username,
      });

      setShouldUpdate(true);

      add({
        name: "Done",
        title: "Ride marked as completed",
        type: "success",
        allowAutoHiding: true,
        timeout: 5000,
      });
    });
  };

  const setupTableActions = (
    item: TRideWithRelation
  ): TableActionConfig<TRideWithRelation>[] => {
    if (!props.withActions) return [];
    if (item.isDriver) {
      return [
        {
          text: "Delete",
          handler: function handler() {
            deleteRideCb(item.id);
          },
        },
        {
          text: "Mark as completed",
          handler: function handler() {
            resolveRideCb(item.id);
          },
        },
      ];
    } else if (!item.isSure) {
      return [
        {
          text: "Accept invitation",
          handler: function handler() {
            acceptInviteCb(item.id);
          },
        },
      ];
    } else return [];
  };

  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && data) {
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

      const count =
        Math.floor(data[props.extractMethod]?.count / MAX_PAGE_SIZE) + 1;

      setPageCount(count ? count : pageCount);
    }
  }, [data]);

  return (
    <>
      <TableWithAction
        className={"ridesharing-table"}
        onRowClick={(event) => {
          console.log(event);
          navigate(`/ride/${event.id}`);
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
        ]}
        data={tableData}
        getRowActions={(item) => setupTableActions(item)}
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

import { MAX_PAGE_SIZE, TableWithAction, TUser } from "../../definitions";
import { DocumentNode, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import { TableActionConfig } from "@gravity-ui/uikit";

export const UsersTable = (props: {
  graphQlMethod: DocumentNode;
  methodProps: { id: string };
  extractMethod: string;
  withPagination: boolean;
  tableActions: TableActionConfig<TUser>[];
}) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(MAX_PAGE_SIZE);

  const { data, loading, error, refetch } = useQuery(props.graphQlMethod, {
    variables: {
      ...props.methodProps,
    },
  });

  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && data) {
      if (!data[props.extractMethod].length) {
        setTableData([]);
        return;
      }

      setTableData(data[props.extractMethod]);
    }
  }, [data]);

  return (
    <div>
      <TableWithAction
        className={"ridesharing-table"}
        onRowClick={(event) => {
          console.log(event);
          // navigate(`/user/${event.id}`)
        }}
        columns={[
          {
            id: "id",
            name: "ID",
          },
          {
            id: "username",
            name: "Username",
          },
        ]}
        data={tableData}
        getRowActions={() => props.tableActions}
      />
      {props.withPagination && (
        <Pagination count={pageCount} page={pageNumber} color="primary" />
      )}
    </div>
  );
};

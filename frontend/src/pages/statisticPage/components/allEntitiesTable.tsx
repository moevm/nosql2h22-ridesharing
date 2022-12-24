import React, { useEffect, useState } from "react";
import { DocumentNode, useLazyQuery, useQuery } from "@apollo/client";
import { TUser } from "../../../definitions";
import { Table } from "@gravity-ui/uikit";
import { Pagination } from "@mui/material";
import { TableColumnConfig } from "@gravity-ui/uikit/build/esm/components/Table/Table";

export const AllEntitiesTable = (props: {
  columns: TableColumnConfig<any>[];
  graphQlMethod: DocumentNode;
  extractMethod: string;
}) => {
  const [pageNumber, setPageNumber] = useState(1);
  let [getData, { data, loading, error, refetch }] = useLazyQuery(
    props.graphQlMethod,
  );

  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && data) {
      setTableData(data[props.extractMethod]);
    }
  }, [data]);

  useEffect(() => {
    refetch({ pagenumber: pageNumber });
  }, [pageNumber]);

  useEffect(() => {
    getData({
      variables: {
        pagenumber: pageNumber,
      },
    });
  }, []);

  return (
    <>
      <Table columns={props.columns} data={tableData} />
      <Pagination
        count={10}
        color="primary"
        onChange={(event, page) => {
          setPageNumber(page);
        }}
      />
    </>
  );
};

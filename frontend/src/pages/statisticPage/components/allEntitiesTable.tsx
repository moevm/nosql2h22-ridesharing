import React, { useEffect, useState } from "react";
import { DocumentNode, useLazyQuery, useQuery } from "@apollo/client";
import { MAX_PAGE_SIZE } from "../../../definitions";
import { Table } from "@gravity-ui/uikit";
import { Pagination } from "@mui/material";
import { TableColumnConfig } from "@gravity-ui/uikit/build/esm/components/Table/Table";

export const AllEntitiesTable = (props: {
  columns: TableColumnConfig<any>[];
  graphQlMethod: DocumentNode;
  graphQlCountMethod: DocumentNode;
  extractMethod: string;
  extractCountMethod: string;
}) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(MAX_PAGE_SIZE);

  const [getData, { data, loading, error, refetch }] = useLazyQuery(
    props.graphQlMethod
  );

  const {
    data: countData,
    loading: countLoading,
    error: countError,
  } = useQuery(props.graphQlCountMethod);

  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && data) {
      setTableData(data[props.extractMethod]);
    }
  }, [data]);

  useEffect(() => {
    if (!countLoading && countData) {
      setPageCount(
        Math.floor(countData[props.extractCountMethod] / MAX_PAGE_SIZE) + 1
      );
    }
  }, [countData]);

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
      <Table
        className={"ridesharing-table"}
        columns={props.columns}
        data={tableData}
      />
      <Pagination
        count={pageCount}
        page={pageNumber}
        color="primary"
        onChange={(event, page) => {
          setPageNumber(page);
        }}
      />
    </>
  );
};

import React, { useEffect, useState } from "react";
import { DocumentNode, useLazyQuery, useQuery } from "@apollo/client";
import { MAX_PAGE_SIZE, TableWithAction } from "../../../definitions";
import { Pagination } from "@mui/material";
import { TableColumnConfig } from "@gravity-ui/uikit/build/esm/components/Table/Table";
import { TableActionConfig } from "@gravity-ui/uikit/build/esm/components/Table/hoc/withTableActions/withTableActions";

export const AllEntitiesTable = (props: {
  columns: TableColumnConfig<any>[];
  graphQlMethod: DocumentNode;
  graphQlCountMethod: DocumentNode;
  extractMethod: string;
  extractCountMethod: string;
  setupTableActions?: (item: any) => TableActionConfig<any>[];
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
      console.log(countData);
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
      <TableWithAction
        className={"ridesharing-table"}
        columns={props.columns}
        data={tableData}
        emptyMessage="No data at all ¯\_(ツ)_/¯"
        getRowActions={(item) =>
          props.setupTableActions ? props.setupTableActions(item) : []
        }
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

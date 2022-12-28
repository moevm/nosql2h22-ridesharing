import React, { useEffect, useState } from "react";
import { DocumentNode, useLazyQuery, useQuery } from "@apollo/client";
import { MAX_PAGE_SIZE, TableWithAction } from "../../../definitions";
import { Pagination } from "@mui/material";
import { TableColumnConfig } from "@gravity-ui/uikit/build/esm/components/Table/Table";
import { TableActionConfig } from "@gravity-ui/uikit/build/esm/components/Table/hoc/withTableActions/withTableActions";

// @ts-ignore
import { debounce } from "lodash";

import "./style.scss"

export const AllEntitiesTable = (props: {
  columns: TableColumnConfig<any>[];
  graphQlMethod: DocumentNode;
  graphQlCountMethod: DocumentNode;
  extractMethod: string;
  extractCountMethod: string;
  stringQuery?: string;
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
    refetch: refetchCount,
  } = useQuery(props.graphQlCountMethod);

  const [tableData, setTableData] = useState<any[]>([]);

  const debouncedRunWithQuery = debounce(() => {
    getData({
      variables: {
        pagenumber: pageNumber,
        query: props.stringQuery,
      },
    });
    refetchCount({
      query: props.stringQuery,
    });
  }, 1000);

  useEffect(() => {
    debouncedRunWithQuery();
  }, [props.stringQuery]);

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
      <TableWithAction
        className={"all-entities-table"}
        columns={props.columns}
        data={tableData}
        emptyMessage="No data at all ¯\_(ツ)_/¯"
        getRowActions={(item) =>
          props.setupTableActions ? props.setupTableActions(item) : []
        }
      />
      <Pagination
        className={"all-entities-table-pagination"}
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

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table,
  ColumnFiltersState,
  FilterFn,
} from "@tanstack/react-table";
import React, { FC } from "react";
import { SolTransaction } from "../models/SolTransaction";
import { rankItem } from "@tanstack/match-sorter-utils";
import { lamportsToSol } from "../utils";
import { Timestamp } from "firebase/firestore";
import { VisuallyHidden } from "@reach/visually-hidden";

type Props = {
  data: SolTransaction[];
  handleRowClick: (transaction: SolTransaction) => void;
};
const SolTransactionTable: FC<Props> = ({ data, handleRowClick }) => {
  //define columns & filter state for React-Table component
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns: ColumnDef<SolTransaction>[] = [
    {
      header: "Amount (Lamports)",
      accessorKey: "amount",
      cell: (info) => info.getValue(),
      footer: (props) => props.column.id,
      size: 60,
      maxSize: 60,
    },
    {
      header: "Solana Amount",
      accessorKey: "amount",
      cell: (info) => lamportsToSol(Number(info.getValue())),
      id: "solanaAmount",
      footer: (props) => props.column.id,
      enableColumnFilter: false,
      size: 70,
      maxSize: 70,
    },
    {
      header: "To Public Key",
      accessorKey: "toAddress",
      cell: (info) => info.getValue(),
      footer: (props) => props.column.id,
      size: 60,
      maxSize: 60,
    },
    {
      header: "Timestamp",
      accessorKey: "timestamp",
      cell: (info) => {
        const timestampDate = (info.getValue() as Timestamp).toDate();
        return (
          timestampDate.toLocaleDateString() +
          " " +
          timestampDate.toLocaleTimeString()
        );
      },
      footer: (props) => props.column.id,
      filterFn: (row, columnId, value) => {
        const [start, end] = [
          Date.parse(value[0]),
          Date.parse(value[1]) + 60 * 60 * 24 * 1000, //end date threshold at end of day in milliseconds
        ];
        const timestampDate = (row.getValue(columnId) as Timestamp).toDate();
        if (start && end) {
          return (
            timestampDate.getTime() >= start && timestampDate.getTime() <= end
          );
        } else if (start) {
          return timestampDate.getTime() >= start;
        } else if (end) {
          return timestampDate.getTime() <= end;
        }
        return true;
      },
      size: 80,
      maxSize: 80,
    },
    {
      header: "Signature",
      accessorKey: "signature",
      cell: (info) => info.getValue(),
      footer: (props) => props.column.id,
      size: 60,
      maxSize: 60,
    },
  ];
  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);
    // Store the itemRank info
    addMeta({
      itemRank,
    });
    // Return if the item should be filtered in/out
    return itemRank.passed;
  };
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });
  return (
    <>
      <div css={styles.transactionsHeader}>
        <h2>Your Transactions</h2>
        <div css={styles.headerInputs}>
          <div>
            <label htmlFor="globalSearch">Filter Columns:</label>
            <DebouncedInput
              id="globalSearch"
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              css={styles.searchInput}
              placeholder="Search all columns..."
            />
          </div>
          <div>
            <label htmlFor="numRows">Number of rows:</label>
            <select
              id="numRows"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <table css={styles.transactionsTable}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder ? null : (
                    <div
                      css={
                        header.column.getCanSort()
                          ? styles.headerCellContentSortable
                          : styles.headerCellContent
                      }
                    >
                      <div
                        {...{
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                      {header.column.getCanFilter() ? (
                        <div css="headerCellFilter">
                          <Filter column={header.column} table={table} />
                        </div>
                      ) : null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => handleRowClick(row.original as SolTransaction)}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id + cell.column}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div />
      <div>
        <div css={styles.pageButtons}>
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
        </div>
        <span>
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span>
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
          />
        </span>
      </div>
      <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
    </>
  );
};

function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);
  const isTimestamp = column.id === "timestamp";

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === "number" || isTimestamp
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  // timestamp has date filters "start" and "end"
  if (isTimestamp) {
    const timestampFilterValue = columnFilterValue as [string, string];
    return (
      <div css={styles.doubleFilter}>
        <DebouncedInput
          type="date"
          value={timestampFilterValue?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [string, string]) => [value, old?.[1]])
          }
          placeholder="Start"
        />
        <DebouncedInput
          type="date"
          value={timestampFilterValue?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [string, string]) => [old?.[0], value])
          }
          placeholder="End"
        />
      </div>
    );
  }

  return typeof firstValue === "number" ? (
    <div css={styles.doubleFilter}>
      <DebouncedInput
        type="number"
        min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
        max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [value, old?.[1]])
        }
        placeholder={`Min ${
          column.getFacetedMinMaxValues()?.[0]
            ? `(${column.getFacetedMinMaxValues()?.[0]})`
            : ""
        }`}
      />
      <DebouncedInput
        type="number"
        min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
        max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [old?.[0], value])
        }
        placeholder={`Max ${
          column.getFacetedMinMaxValues()?.[1]
            ? `(${column.getFacetedMinMaxValues()?.[1]})`
            : ""
        }`}
      />
    </div>
  ) : (
    <div css={styles.singleFilter}>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <VisuallyHidden>
        <label htmlFor={"filter" + column.id}>Filter:</label>
      </VisuallyHidden>
      <DebouncedInput
        id={"filter" + column.id}
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        list={column.id + "list"}
      />
    </div>
  );
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default SolTransactionTable;

const styles = {
  searchInput: {},

  transactionsHeader: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    marginBottom: "24px",
  }),
  headerInputs: css({
    display: "flex",
    label: {
      display: "block",
      marginBottom: "2px",
    },
    input: {
      width: "300px",
      marginRight: "20px",
    },
    justifyContent: "space-between",
  }),
  pageButtons: css({
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginTop: "16px",
  }),

  transactionsTable: css({
    textAlign: "left",
    tableLayout: "fixed",
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "18px",
    td: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      padding: "2px 6px",
    },
    th: {
      padding: "2px 6px",
    },
  }),

  headerCellContent: {
    display: "flex",
  },
  headerCellContentSortable: {
    display: "block",
    cursor: "pointer",
    select: "none",
  },

  singleFilter: {
    input: {
      width: "100%",
    },
  },
  doubleFilter: {
    display: "flex",
    justifyContent: "space-between",
    input: {
      width: "48%",
    },
  },
};

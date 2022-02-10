import React, {useState, useMemo} from 'react';
import {useReactTable, getCoreRowModel, getSortedRowModel, flexRender} from '@tanstack/react-table';
import prettyBytes from 'pretty-bytes';
import CommitsList from './CommitsList.jsx';
import timeAgo from '../lib/time-ago.js';
import './Table.scss';

// Memoized cell component to prevent unnecessary re-renders
const MemoizedCell = React.memo(({props}) => {
  return (
    <td className={`cell-${props.column.id}`}>
      <div className={`cell column-id-${props.column.id}`}>{flexRender(props.column.columnDef.cell, props.getContext())}</div>
    </td>
  );
});

// Memoized row component to prevent unnecessary re-renders
const MemoizedRow = React.memo(({row}) => {
  return (
    <tr className={`row-index-${row.index}`}>
      {row.getVisibleCells().map(props => (
        <MemoizedCell key={props.id} props={props} />
      ))}
    </tr>
  );
});

const DataTable = ({data = [], prettyTimeFormat = 1}) => {
  const [sorting, setSorting] = useState([]);

  const columns = [
  /*  {
      header: 'Name',
      accessorKey: 'name',
      cell: info => (
        <a href={`https://github.com/${info.row.original.fullName}`} target="_blank">
          {info.getValue()}
        </a>
      ),
    },*/
    {header: 'Owner', accessorKey: 'owner'},
    {header: 'Stars', accessorKey: 'stars', sortingFn: 'basic'},
    {
      header: () => <>Commits<br />Ahead</>,
      accessorKey: 'commitsAhead',
      sortingFn: 'basic',
      size: 50,
      cell: info => {
        return <span>{info.getValue()}</span>;
      },
    },
    {
      header: () => <>Commits<br />Behind</>,
      accessorKey: 'commitsBehind',
      sortingFn: 'basic',
      size: 50,
      cell: info => {
        return <span>{info.getValue()}</span>;
      },
    },
    {
      header: 'Commits List',
      accessorKey: 'commitsList',
      sortingFn: 'basic',
      cell: info => {
        let commitsList = info.getValue();

        return (
          <CommitsList commits={commitsList} />
        );
      },
    },
    {
      header: 'Size',
      accessorKey: 'size',
      sortingFn: 'basic',
      cell: info => {
        let size = prettyBytes(info.getValue());
        return <span>{size}</span>;
      },
    },
    {
      header: 'Created',
      accessorKey: 'createdAt',
      sortingFn: 'datetime',
      cell: info => <span>{timeAgo(info.getValue())}</span>,
    },
    {
      header: 'Updated',
      accessorKey: 'updatedAt',
      sortingFn: 'datetime',
      cell: info => <span>{timeAgo(info.getValue())}</span>,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Sort the rows based on the rank metadata in descending order
  const sortedRows = useMemo(() => {
    return table.getRowModel().rows.sort((a, b) => {
      const aMeta = a.columnFiltersMeta.fuzzy ?? {rank: Infinity};
      const bMeta = b.columnFiltersMeta.fuzzy ?? {rank: Infinity};
      return aMeta.rank - bMeta.rank;
    });
  }, [table.getRowModel().rows]);

  return (
    <div className="table-container">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: `${header.column.getCanSort() ? 'cursor-pointer select-none' : 'not-sortable'} ${[header.column.getIsSorted() ? 'sorted' : '']}`,
                        onClick: header.column.getToggleSortingHandler(),
                      }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <div className={`sorting-symbol asc`}>⇡</div>,
                        desc: <div className={`sorting-symbol desc`}>⇣</div>,
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {sortedRows.map(row => (
            <MemoizedRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>
      {data.length === 0 && <div>search for somethin'!</div>}
    </div>
  );
};

export default DataTable;

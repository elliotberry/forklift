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

// Memoized cell renderers for better performance
const CommitsCell = React.memo(({commits}) => {
  return <CommitsList commits={commits} />;
});

const SizeCell = React.memo(({size}) => {
  return <span>{prettyBytes(size)}</span>;
});

const TimeCell = React.memo(({date}) => {
  return <span>{timeAgo(date)}</span>;
});

const DataTable = ({data = [], prettyTimeFormat = 1}) => {
  const [sorting, setSorting] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  // Memoized columns definition to prevent recreation on every render
  const columns = useMemo(() => [
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
        return <CommitsCell commits={commitsList} />;
      },
    },
    {
      header: 'Size',
      accessorKey: 'size',
      sortingFn: 'basic',
      cell: info => {
        return <SizeCell size={info.getValue()} />;
      },
    },
    {
      header: 'Created',
      accessorKey: 'createdAt',
      sortingFn: 'datetime',
      cell: info => <TimeCell date={info.getValue()} />,
    },
    {
      header: 'Updated',
      accessorKey: 'updatedAt',
      sortingFn: 'datetime',
      cell: info => <TimeCell date={info.getValue()} />,
    },
  ], [prettyTimeFormat]);

  // Memoized paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage]);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const table = useReactTable({
    data: paginatedData,
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

  const handlePageChange = (newPage) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

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
      
      {/* Pagination controls */}
      {data.length > ITEMS_PER_PAGE && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages} ({data.length} total items)
          </span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
      
      {data.length === 0 && <div>search for somethin'!</div>}
    </div>
  );
};

export default React.memo(DataTable);

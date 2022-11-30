import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

type TableProps = {
  columns: any | [];
  data: {}[] | any;
  title?: string;
};

const Table = ({ columns, data, title }: TableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-x-auto">
      {title && (
        <h2 className="capitalize text-white text-lg py-6 px-8 bg-gradient-to-l from-tifi-dark via-neutral-black-700 to-transparent bg-opacity-30 backdrop-blur-[176px] rounded-t-xl">
          {title}
        </h2>
      )}

      <div className="overflow-x-auto">
        <table className="text-white w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-primary w-full">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-sm text-left text-neutral-black-0 font-normal capitalize whitespace-nowrap py-5 px-4"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-gradient-to-l from-tifi-dark via-neutral-black-700 to-transparent bg-opacity-30 backdrop-blur-[176px]">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="relative">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="text-sm text-white font-normal text-left capitalize whitespace-nowrap py-6 px-4"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

import Table from '@components/elements/Table';
import { createColumnHelper } from '@tanstack/react-table';

type RowsProp = {
  address: string;
  winAmount: number;
};

const columnHelper = createColumnHelper<RowsProp>();

const TopWinnersTable = ({ rows }: any) => {
  console.log(rows);

  const columns = [
    columnHelper.accessor((row) => row.address, {
      id: 'winner',
      header: () => <span>Winner</span>,
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor((row) => row.winAmount, {
      id: 'total',
      header: () => <span>Total Win ($TIFI)</span>,
      cell: (info) => <span>{info.getValue()}</span>,
    }),
  ];

  return (
    <div>
      {rows?.length < 1 ? (
        <div className="p-6 rounded-lg bg-neutral-black-700">
          <h2 className="capitalize text-white text-lg">Jackpot Winners</h2>

          <div className="p-5">
            <p className="text-white text-2xl text-center font-medium">
              No Stake Record Found
            </p>
          </div>
        </div>
      ) : (
        <Table
          columns={columns}
          data={rows}
          title={`winners(${rows.length})`}
        />
      )}
    </div>
  );
};

export default TopWinnersTable;

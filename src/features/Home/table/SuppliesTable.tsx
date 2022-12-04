import { currencyIcon, matic } from '@assets/icons';
import Button from '@components/elements/Button';
import Table from '@components/elements/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { SetStateAction } from 'react';


type Asset = {
  asset: string;
  valueUSD: number;
  apy: string;
  address: string;
  withdraw: string
  supply: string;
};
type SupplyTableProps = {
  openModal: boolean;
  setOpenModal: React.Dispatch<SetStateAction<boolean>>;
  setWithdrawModal: React.Dispatch<SetStateAction<boolean>>;
  balance: number;
};
const columnHelper = createColumnHelper<Asset>();

const SupplyTable: React.FC<SupplyTableProps> = ({
  openModal,
  setOpenModal,
  setWithdrawModal,
  balance,
}) => {

  const defaultData: Asset[] = [
    {
      asset: "MATIC",
      valueUSD: 1.0,
      apy: '<0.01%',
      address: '',
      withdraw: '',
      supply: ''
    },
  ];

  const columns = [
    columnHelper.accessor((row) => row.asset, {
      id: 'asset',
      header: () => <span>Assets</span>,
      cell: (info) => <div className='flex items-center'><span className=''><img src={matic} alt="Logo" /></span><span className='ml-2'>{info.getValue().toUpperCase()}</span></div>,
    }),
    columnHelper.accessor((row) => row.valueUSD, {
      id: 'valueUSD',
      header: () => <span>Balance</span>,
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor((row) => row.apy, {
      id: 'apy',
      header: () => <span>APY</span>,
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor('withdraw', {
      header: () => <span></span>,
      cell: (info) => (
        <span>
          <Button
            label="Withdraw"
            className="bg-primary text-xs"
            onClick={() => {
              setOpenModal(false);
              setWithdrawModal(true);
            }}
          />
        </span>
      ),
    }),
    columnHelper.accessor('supply', {
      header: () => <span></span>,
      cell: (info) => (
        <span>
          <Button
            label="Supply"
            onClick={() => {
              setOpenModal(true);
              setWithdrawModal(false);
            }}
            className=" text-xs border border-purple-500 hover:opacity-50 hover:bg-primary-400 transition-all duration-500 ease-out"
          />
        </span>
      ),
    }),
  ];
  return <Table columns={columns} data={defaultData} />;
};

export default SupplyTable;

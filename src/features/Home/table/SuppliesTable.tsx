import Button from '@components/elements/Button';
import Table from '@components/elements/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { SetStateAction } from 'react';

type Person = {
    amount: number;
    valueUSD: number;
    valueBNB: number;
    time: number;
    withdrawBtn: string;
    supplyBtn: string
};

type SupplyTableProps = {
    openModal: boolean;
    setOpenModal: React.Dispatch<SetStateAction<boolean>>;
    setWithdrawModal: React.Dispatch<SetStateAction<boolean>>
}
const columnHelper = createColumnHelper<Person>();

const SupplyTable: React.FC<SupplyTableProps> = ({ openModal, setOpenModal, setWithdrawModal }) => {
    const defaultData: Person[] = [
        {
            amount: 647,
            valueUSD: 83750,
            valueBNB: 24,
            time: 100,
            withdrawBtn: "",
            supplyBtn: ""
        },
        {
            amount: 877,
            valueUSD: 2093.7,
            valueBNB: 40,
            time: 40,
            withdrawBtn: "",
            supplyBtn: ""
        },
        {
            amount: 196,
            valueUSD: 1976.14,
            valueBNB: 45,
            time: 20,
            withdrawBtn: "",
            supplyBtn: ""
        },
        {
            amount: 492,
            valueUSD: 1948.81,
            valueBNB: 45,
            time: 20,
            withdrawBtn: "",
            supplyBtn: ""
        },
    ];

    const columns = [
        columnHelper.accessor((row) => row.amount, {
            id: 'amount',
            header: () => <span>Assets</span>,
            cell: (info) => <span>{info.getValue()}</span>,
        }),
        columnHelper.accessor((row) => row.valueUSD, {
            id: 'valueUSD',
            header: () => <span>Balance</span>,
            cell: (info) => <span>{info.getValue()}</span>,
        }),
        columnHelper.accessor((row) => row.valueBNB, {
            id: 'valueBNB',
            header: () => <span>APY</span>,
            cell: (info) => <span>{info.getValue()}</span>,
        }),
        columnHelper.accessor('time', {
            header: () => <span>Collateral</span>,
        }),
        columnHelper.accessor('withdrawBtn', {
            header: () => <span></span>,
            cell: (info) => <span><Button label="Withdraw" className='bg-primary text-xs' onClick={() => {
                setOpenModal(false)
                setWithdrawModal(true)
            }} /></span>
        }),
        columnHelper.accessor('supplyBtn', {
            header: () => <span></span>,
            cell: (info) => <span><Button label="Supply" onClick={() => {
                setOpenModal(true)
                setWithdrawModal(false)
            }} className=' text-xs border border-purple-500 hover:opacity-50 hover:bg-primary-400 transition-all duration-500 ease-out' /></span>
        }),
    ];
    return <Table columns={columns} data={defaultData} />;
};

export default SupplyTable;

import Table from '@components/elements/Table';
import { createColumnHelper } from '@tanstack/react-table';

type Person = {
    amount: number;
    valueUSD: number;
    valueBNB: number;
    time: number;
};

const columnHelper = createColumnHelper<Person>();

const BorrowTable = () => {
    const defaultData: Person[] = [
        {
            amount: 647,
            valueUSD: 83750,
            valueBNB: 24,
            time: 100,
        },
        {
            amount: 877,
            valueUSD: 2093.7,
            valueBNB: 40,
            time: 40,
        },
        {
            amount: 196,
            valueUSD: 1976.14,
            valueBNB: 45,
            time: 20,
        },
        {
            amount: 492,
            valueUSD: 1948.81,
            valueBNB: 45,
            time: 20,
        },
    ];

    const columns = [
        columnHelper.accessor((row) => row.amount, {
            id: 'amount',
            header: () => <span>Amount of TiFi</span>,
            cell: (info) => <span>{info.getValue()}</span>,
        }),
        columnHelper.accessor((row) => row.valueUSD, {
            id: 'valueUSD',
            header: () => <span>Value USD</span>,
            cell: (info) => <span>{info.getValue()}</span>,
        }),
        columnHelper.accessor((row) => row.valueBNB, {
            id: 'valueBNB',
            header: () => <span>Value BNB</span>,
            cell: (info) => <span>{info.getValue()}</span>,
        }),
        columnHelper.accessor('time', {
            header: () => <span>Time</span>,
        }),
    ];
    return <Table columns={columns} data={defaultData} />;
};

export default BorrowTable;

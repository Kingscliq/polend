import { currencyIcon, logo } from '@assets/icons';
import Button from '@components/elements/Button';
import Table from '@components/elements/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { SetStateAction } from 'react';

type Asset = {
    asset: string;
    valueUSD: number;
    apy: string;
    address: string;
    action: string;
};

interface AssetsTableProps {
    openModal: boolean;
    setOpenModal: React.Dispatch<SetStateAction<boolean>>
}

const columnHelper = createColumnHelper<Asset>();

const AssetsTable: React.FC<AssetsTableProps> = ({ openModal, setOpenModal }) => {
    const defaultData: Asset[] = [
        {
            asset: "cusd",
            valueUSD: 1.0,
            apy: '<0.01%',
            address: '',
            action: '',
        },
    ];

    const columns = [
        columnHelper.accessor((row) => row.asset, {
            id: 'amount',
            header: () => <span>Assets</span>,
            cell: (info) => <div className='flex items-center'><span className=''><img src={currencyIcon} alt="Logo" /></span><span className='ml-2'>{info.getValue().toUpperCase()}</span></div>,
        }),
        columnHelper.accessor((row) => row.valueUSD, {
            id: 'valueUSD',
            header: () => <span>Available</span>,
            cell: (info) => <span>{info.getValue()}</span>,
        }),
        columnHelper.accessor((row) => row.apy, {
            id: 'valueBNB',
            header: () => <span>APY</span>,
            cell: (info) => <span>{info.getValue()}</span>,
        }),
        columnHelper.accessor('action', {
            header: () => <span></span>,
            cell: (info) => <span><Button label="Borrow" className='text-xs bg-primary transition-all duration-500 ease-out' onClick={() => setOpenModal(true)} /></span>
        }),
    ];
    return <Table columns={columns} data={defaultData} />;
};

export default AssetsTable;

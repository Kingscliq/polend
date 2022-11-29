import { Link } from 'react-router-dom';
import Table from '@components/elements/Table';
import { LP_TOKENS } from '@config/constants';
import { getTvl } from '@features/Stake/api';
import { useLanguage, useLanguageActions } from '@hooks/useLanguage';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { toFixed } from '@utils/tifi';
import { useEffect, useState } from 'react';
import { T } from 'react-translator-component';
import { BounceLoader } from '@components/elements/Loaders';

type RowDataProps = {
  name: number;
  liquidity: number;
  apy: number;
  action: number;
};

const columnHelper = createColumnHelper<RowDataProps>();

const PoolAnalyticsTable = () => {
  // language state
  const { language } = useLanguage();
  const { setLanguage } = useLanguageActions();

  useEffect(() => {
    setLanguage({ language: language });
  }, [language, setLanguage]);

  const [rows, setRows] = useState<any>([]);

  const { data: tvl, isLoading: isTvlLoading } = useQuery(['tvl-data'], getTvl);

  useEffect(() => {
    if (tvl?.total_tvl) {
      const rowsData = tvl.pairs.map((p) => {
        let lpt = LP_TOKENS.filter((item) => item.address === p.address)[0];
        return { ...lpt, liquidity: p.tvl, apy: p.apy, name: p.name };
      });
      setRows(rowsData);
    } else {
      getTvl();
    }
  }, [tvl?.pairs, tvl?.total_tvl]);

  const columns = [
    columnHelper.accessor((row) => row.name, {
      id: 'name',
      header: () => <span>{T('Name')}</span>,
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor((row) => row.liquidity, {
      id: 'liquidity',
      header: () => <span>{T('Liquidity')}</span>,
      cell: (info) => <span>$ {toFixed(Number(info.getValue()))}</span>,
    }),
    columnHelper.accessor((row) => row.apy, {
      id: 'apy',
      header: () => <span>{T('APY')}</span>,
      cell: (info) => (
        <span>
          {info.getValue() === -1
            ? 'N/A'
            : toFixed(100 * Number(info.getValue())) + ' %'}
        </span>
      ),
    }),
    columnHelper.accessor('action', {
      cell: () => (
        <span className="px-4 py-2 border border-white w-32 text-sm rounded">
          <Link to="/liquidity">{T('Add Liquidity')}</Link>
        </span>
      ),
    }),
  ];

  return (
    <>
      {isTvlLoading ? (
        <BounceLoader text="Loading data, Please Wait... 😇" />
      ) : (
        <>
          {rows?.length < 1 ? (
            <div className="p-6 rounded-lg bg-neutral-black-700">
              <h2 className="capitalize text-white text-lg">Pools</h2>

              <div className="p-5">
                <p className="text-white text-2xl text-center font-medium">
                  No Pool Record Found
                </p>
              </div>
            </div>
          ) : (
            <Table columns={columns} data={rows} title="pools" />
          )}
        </>
      )}
    </>
  );
};

export default PoolAnalyticsTable;

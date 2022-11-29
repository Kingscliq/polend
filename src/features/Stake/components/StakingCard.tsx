// import { logo } from '@//assets/icons';
import React from 'react'
import { ReactNode } from 'react';
import { logo } from '../../../assets/icons';

interface StakeCardProps {
    balance: number;
    amount: number;
    copyChildren?: ReactNode;
    fromText: string;
}

const StakeCard: React.FC<StakeCardProps> = ({ balance, amount, copyChildren, fromText }) => {
    return (
        <section className='bg-neutral-black-500 p-4 text-white rounded-lg'>
            <div className='flex items-center justify-between'>
                <div>
                    <small className='text-neutral-black-0 text-xs'>{fromText || "From"}</small>
                </div>
                <div>
                    <small className='text-neutral-black-0 text-xs'>Balance: {balance || '1'}</small>
                </div>
            </div>
            <div className='flex items-center justify-between my-2'>
                <div>
                    <select className='bg-transparent'>
                        <option value="BNB"><img src={logo} alt="Logo" />BNB</option>
                    </select>
                </div>
                <div>
                    <h2 className='text-[1.75rem]'>{amount || '0.00'}</h2>
                </div>
            </div>
            <div className='flex items-center justify-between'>
                <div>{copyChildren && copyChildren}</div>
                <div className='border border-primary rounded-lg px-1'>
                    <small className='text-xs'>Max</small>
                </div>
            </div>
        </section>
    )
}

export default StakeCard
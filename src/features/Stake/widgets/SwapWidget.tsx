// import { swapChart } from '@//assets/icons'
import React from 'react'
import { ReactNode } from 'react'
import { swapChart } from '../../../assets/icons'

interface SwapWidgetProps {
    children: ReactNode
}
const SwapWidget: React.FC<SwapWidgetProps> = ({ children }) => {
    return (
        <section className='bg-tifi-dark rounded-xl p-4 lg:p-8 '>
            <section className='flex items-center justify-between bg-tifi-dark rounded-xl mb-4'>
                <h2 className='text-3xl text-white'>Swap</h2>
                <div>
                    <img src={swapChart} alt="Tifi Swap" />
                </div>
            </section>
            <section>{children}</section>
        </section>
    )
}

export default SwapWidget
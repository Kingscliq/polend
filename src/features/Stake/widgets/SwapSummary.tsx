// import Card from '@//components/elements/Card'
import React from 'react'
import Card from '../../../components/elements/Card'


interface SwapSummaryProps {
    swap_fee?: string
    price_impact?: string;
    route?: string;
    tifi_fee?: string;
}
const SwapSummary: React.FC<SwapSummaryProps> = ({ swap_fee, price_impact, route, tifi_fee }) => {
    return (
        <Card className='rounded-2xl my-4'>
            <div data-aos="fade-up"
                data-aos-duration="3000">
                <div className='flex items-center justify-between mb-4 text-xs'>
                    <div className='text-neutral-black-10'>Swap Fee</div>
                    <div className='text-white'>{swap_fee}</div>
                </div>
                {price_impact !== "" && <div className='flex items-center justify-between  mb-4  text-xs'>
                    <div className='text-neutral-black-10'>Price Impact</div>
                    <div className='text-white'>{price_impact}</div>
                </div>}

                <div className='flex items-center justify-between  mb-4 text-xs'>
                    <div className='text-neutral-black-10'>Route</div>
                    <div className='text-white'>{route}</div>
                </div>
                <div className='flex items-center justify-between text-xs'>
                    <div className='text-neutral-black-10'>TiFi Fee</div>
                    <div className='text-white'>{tifi_fee}</div>
                </div>
            </div>

        </Card>
    )
}

export default SwapSummary
// import Card from '@//components/elements/Card'
import React from 'react'
import Card from '../../../components/elements/Card'


interface StakeSummaryProps {
    swap_fee?: string

}
const StakeSummary: React.FC<StakeSummaryProps> = ({ swap_fee }) => {
    return (
        <Card className='rounded-2xl my-4'>
            <div data-aos="fade-up"
                data-aos-duration="3000">
                <div className='flex items-center justify-between mb-4 text-xs'>
                    <div className='text-neutral-black-10'>Swap Fee</div>
                    <div className='text-white'>{swap_fee}</div>
                </div>
            </div>

        </Card>
    )
}

export default StakeSummary
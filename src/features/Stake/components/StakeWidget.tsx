// import { arrowLeft } from '@//assets/icons';
// import Button from '@//components/elements/Button';
// import Card from '@//components/elements/Card';
import React, { ReactNode } from 'react'
import { arrowLeft } from '../../../assets/icons';
import Card from '../../../components/elements/Card';


interface StakeWidgetProps {
    children: ReactNode;
    title?: string;
    onClick?: () => void
}

const StakeWidget: React.FC<StakeWidgetProps> = ({ children, title, onClick }) => {
    return (
        <Card>
            <div className='flex items-center mb-5'>
                <div className='mr-4'>
                    <button onClick={onClick}>
                        <img src={arrowLeft} alt="Arrow left" />
                    </button>
                </div>
                <div>
                    <h2 className='text-lg text-white'>{title || " Stake TiFi"}</h2>
                </div>
            </div>
            <div className='mb-5'>
                {children}
            </div>
            {/* <div>
                <Button className='bg-primary text-white' label={btnLabel} />
            </div> */}
        </Card>
    )
}

export default StakeWidget
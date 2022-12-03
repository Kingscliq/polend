import Modal from '@components/elements/Modal'
import React, { SetStateAction } from 'react'
import CustomTextField from '../components/CustomTextField';

interface BorrowModalProps {
    openModal: boolean;
    setOpenModal: React.Dispatch<SetStateAction<boolean>>
}

const BorrowModal: React.FC<BorrowModalProps> = ({ openModal, setOpenModal }) => {
    return (
        <Modal
            title="Borrow"
            modalClose={() => setOpenModal(false)}
            modalBody={
                <div className='my-5'>
                    <div>
                        <CustomTextField label='Amount' placeholder='$0.00' />
                    </div>
                    <small>Transaction Summary</small>
                    <div className='border-purple-50 opacity-40 border p-2'>
                        <div className='flex items-center justify-between'>
                            <div></div>
                            <div></div>
                        </div>
                        <div></div>
                        <div></div>
                    </div>

                </div>
            }
        />
    )
}

export default BorrowModal
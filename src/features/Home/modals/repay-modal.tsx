import Button from '@components/elements/Button';
import Modal from '@components/elements/Modal'
import React, { SetStateAction } from 'react'
import CustomTextField from '../components/CustomTextField';

interface SupplyModalProps {
    openModal: boolean;
    setOpenModal: React.Dispatch<SetStateAction<boolean>>
    repayAmount: number | string;
    setRepayAmount: React.Dispatch<SetStateAction<string | number>>
    handleRepay: () => void;
    loading: boolean
}

const RepayModal: React.FC<SupplyModalProps> = ({ openModal, setOpenModal, repayAmount, setRepayAmount, handleRepay, loading }) => {
    return (
        <Modal
            title="Repay"
            modalClose={() => setOpenModal(false)}
            modalBody={
                <div className='my-5 text-white/75'>
                    <div>
                        <CustomTextField coinLabel='USD' label='Amount' placeholder='$0.00' value={repayAmount} onChange={(e) => setRepayAmount(e.target.value)} />
                    </div>
                    <div className='my-8'>
                        <h3 className='mb-2'>Transaction Summary</h3>
                        <div className="border-purple-50/40 opacity-40 border p-2">
                            <div className="my-3 flex items-center justify-between">
                                <div>
                                    <small>Remaing Debts</small>
                                </div>
                                <div className="text-green-400">
                                    <small>0.0098</small>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <small>Health Factor</small>
                                </div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Button label={`${repayAmount <= 0 || repayAmount === "" ? "Enter Amount" : "Repay Asset"}`} className='bg-primary' disabled={repayAmount <= 0} onClick={handleRepay} loading={loading} />
                    </div>
                </div>
            }
        />
    )
}

export default RepayModal
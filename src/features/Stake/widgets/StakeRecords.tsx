import { StakeItem } from "../components/StakeItem";
import { useStake } from "../hooks/useGetStakeRecords";


const StakeRecords: React.FC<{}> = () => {
    const { records } = useStake()

    return (
        <>
            {records && records?.length > 0 && records?.map((record) => (
                <StakeItem timestamp={record.timestamp} stakeAmount={record.stakeAmount} curAmount={record.curAmount} wbnbAmount={record.wbnbAmount} />
            ))}
        </>
    );
};

export default StakeRecords
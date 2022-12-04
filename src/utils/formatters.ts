import moment from 'moment'

// Format Date Time
export const getDateTime = (val: string | number) => `${moment(val).format('DD/MM/YYYY')} | ${moment(val).format('hh:mm a')}`;
export const shorten = (str: string) => `${str.slice(0, 5)}...${str.slice(str.length - 4)}`

export const getErrorMessage = (error: any) => {
    if (error.code === 'INVALID_ARGUMENT') {
        return "The number is invalid, maybe too big?";
    }
    if (error.code === 'NETWORK_ERROR') {
        return "You are not on the BSC main net. Please switch to the main net.";
    }
    if (error.code === 'CALL_EXCEPTION') {
        if (error.reason === 'TiFiLibrary: IDENTICAL_ADDRESSES') {
            return "You have selected the same tokens, please select a different token.";
        }
        return "The pair doesn't exist, please select another pair.";
    }
    if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        if (error.reason === 'execution reverted: TiFiReservior: DEPOSIT_AMOUNT_INVALID') {
            return "Please stake at least 1 TIFI as minimum requirement.";
        }
        return "Not enough balance for the transaction.";
    }
    if (error.code === 4001) {
        return "Transaction rejected by user.";
    }
    if (error.code === -32603) {
        return "Insufficient balance to perform this transaction."
    }
    return null;
}
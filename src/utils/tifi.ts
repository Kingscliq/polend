import { SelectedProps } from './../components/elements/DropdownModal/index';
import { LP_TOKENS, TOKENS } from "../config/constants";

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

export const toFixed = (x: number | string | any, precision = 6) => {
    x = x.toPrecision(precision);
    if (Math.abs(x) < 1.0) {
        let e = parseInt(x.toString().split('e-')[1]);
        if (e) {
            x *= Math.pow(10, e - 1);
            x = '0.' + (new Array(e)).join('0') + x.toString().substring(2, 8);
        }
    } else {
        let s = x.toString().split('+');
        let e = parseInt(s[1]);
        if (e > 0) {
            let d = s[0].split('.');
            x = (d[0] + d[1]).slice(0, -1) + '0'.repeat(e + 1 - d[1].length)
        }
    }
    if (x.indexOf('.') >= 0) {
        while ((x.slice(-1) === '0' || x.slice(-1) === '.') && x.indexOf('.') !== -1) {
            x = x.substr(0, x.length - 1);
        }
    }
    return x;
}

// // Encode by Sorting Token Name
export const encodePair = (t1: any, t2: number) => {
    return t1 > t2 ? t2 + '|' + t1 : t1 + '|' + t2;
}

// Existing Pairs
export const encodedPairs = new Set(LP_TOKENS.map(p => encodePair(p.token0_name as any, p.token1_name as any)));

// Token symbol - address map
export const tokenMap = new Map(TOKENS.map(t => [t.title, t.address]));

// Get token path
export const getTokenPath = (t1: any, t2: any) => {
    if (encodedPairs.has(encodePair(t1, t2))) {
        return [t1, t2];
    }
    // Doesn't have direct pair
    if (encodedPairs.has(encodePair('BNB', t1)) && encodedPairs.has(encodePair('BNB', t2))) {
        return [t1, 'BNB', t2];
    }
    // No path found
    return [];
}

// // Process big numbers, e.g. from unit wei
export const processBigNumber = (n: any) => {
    if (Number(n) <= 1) {
        return 0;
    }
    return (parseFloat(n) / 10 ** 18).toFixed(16);
}

// // Extend to big number, e.g. to unit wei
export const extendToBigNumber = (n: any) => {
    if (Number(n) < 100) {
        return (Number(n) * 10 ** 18).toString();
    }
    return parseInt(n).toString() + "000000000000000000";
}

export const getPriceImpact = (p0: number, p1: number, unitPrice: number) => {
    return 100 * (Math.abs((p0 / p1) / unitPrice - 1));
}

export const getTokenPriceUsingAmount = (r0: number, r1: number, amount: number) => {
    let _amount = amount * 9980;
    return _amount * r1 / (r0 * 10000 + _amount);
}

export const calculatePriceImpact = (pi1: number, pi2: number, highImpact: any) => {
    let mathFunction = highImpact ? Math.max : Math.min;
    return toFixed(100 * (mathFunction(Math.abs(pi1 - 1), Math.abs(pi2 - 1))));
}

export const getSwapPath = (token0: SelectedProps, token1: SelectedProps) => {
    return getTokenPath(token0.title, token1.title).map(item => tokenMap.get(item));
}

export const descendingComparator = (a: { [x: string]: number; }, b: { [x: string]: number; }, orderBy: string | number) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export const getComparator = (order: string, orderBy: string | number) => {
    return order === "desc"
        ? (a: { [x: string]: number; }, b: { [x: string]: number; }) => descendingComparator(a, b, orderBy)
        : (a: { [x: string]: number; }, b: { [x: string]: number; }) => -descendingComparator(a, b, orderBy);
}

// // This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
export const stableSort = (array: any[], comparator: (arg0: any, arg1: any) => any) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}


export const convertNumber = (labelValue: any) => {
    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+12
        ? (Math.abs(Number(labelValue)) / 1.0e+12).toFixed(2) + "T" :
        Math.abs(Number(labelValue)) >= 1.0e+9
            ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
            // Six Zeroes for Millions 
            : Math.abs(Number(labelValue)) >= 1.0e+6
                ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
                // Three Zeroes for Thousands
                : Math.abs(Number(labelValue)) >= 1.0e+3
                    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"
                    : Math.abs(Number(labelValue)).toFixed(2);
}

export const nFormatter = (num: number, digits: number | undefined) => {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "K" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

export const ACCOUNT_HEALTH = ['UNHEALTHY', 'WARNING', 'FAIR', 'GOOD', 'VERY GOOD'];




export { }
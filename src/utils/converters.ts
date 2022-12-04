// // Extend to big number, e.g. to unit wei
export const extendToBigNumber = (n: any) => {
    if (Number(n) < 100) {
        return (Number(n) * 10 ** 18).toString();
    }
    return parseInt(n).toString() + "000000000000000000";
}
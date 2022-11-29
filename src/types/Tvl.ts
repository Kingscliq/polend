export interface Tvl {
    pairs: { name: string; address: string; tvl: number; apy: number }[],
    stakes: { address: string; tvl: number }[],
    tifi_price: number;
    total_tvl: number
    // {
    //     "pairs": [
    //         {
    //             "name": "BNB-TIFI",
    //             "address": "0x707b6f02ffc0c7fd9fe3a4f392aef47218021337",
    //             "tvl": 30399.719585703337,
    //             "apy": 0.10134404494818727
    //         },
    //         {
    //             "name": "BNB-BUSD",
    //             "address": "0x76fc4931d9d3a2054aee2d59633e49b759277d69",
    //             "tvl": 772.6759645763693,
    //             "apy": 0.03786943414352262
    //         },
    //         {
    //             "name": "BNB-USDT",
    //             "address": "0x35bcB082347DC28D3B7E28AbD383aFE653A6DADA",
    //             "tvl": 918.4542840782622,
    //             "apy": 0.06940204660921223
    //         },
    //         {
    //             "name": "BNB-MFX",
    //             "address": "0xfeaCE6Ba3B5cDC9Bb045F95A588a1b3D09ab812A",
    //             "tvl": 13048.799430298974,
    //             "apy": -1
    //         }
    //     ],
    //     "stakes": [
    //         {
    //             "address": "0x0AEfF3d761F6706295f3828C87ccE29c9418a93B",
    //             "tvl": 2004258.7925919963
    //         }
    //     ],
    //     "total_tvl": 2049398.4418566532,
    //     "tifi_price": 6.291735742276519e-8
    // }
}
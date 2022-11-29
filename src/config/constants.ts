import { bnb, busd, mfx, tifi, usdt } from "@assets/icons/currencies";

export const ROOT_PATH = "/bank";
export const ENV = "TESTNET"; // MAINNET or TESTNET

export const STAKE_BNB_FEE = "0.02";
export const STAKE_NO_REWARD = 0;
export const STAKE_HALF_REWARD = 1;
export const STAKE_FULL_REWARD = 2;

export const ChainInfo = {
  MAINNET: {
    network_id: 56,
    explorer_url: "https://bscscan.com",
    rpc_url: "https://bsc-dataseed.binance.org/",
    tokens: [
      {
        address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        title: "BNB",
        description: "BNB",
        apiId: "bnb",
        icon: bnb,
        value: 0
      },
      {
        address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        title: "BUSD",
        description: "BUSD Token",
        apiId: "binance-usd",
        icon: busd,
        value: 0
      },
      {
        address: "0x17E65E6b9B166Fb8e7c59432F0db126711246BC0",
        title: "TIFI",
        description: "TiFi Token",
        apiId: "tifi-token",
        icon: tifi,
        value: 0
      },
      {
        address: "0x55d398326f99059fF775485246999027B3197955",
        title: "USDT",
        description: "Tether",
        apiId: "tether",
        icon: usdt,
        value: 0
      },
      {
        address: "0x6266a18F1605DA94e8317232ffa634C74646ac40",
        title: "MFX",
        description: "MetFX Watch To Earn",
        apiId: "metfx-watch-to-earn",
        icon: mfx,
        value: 0
      }
    ],
    contracts: {
      GET_PRICE_ADDRESS: "0x9D1FC5AD7AC6ff99e2cE4826678c6cc0a0c8F278",
      ROUTER_ADDRESS: "0xC8595392B8ca616A226dcE8F69D9E0c7D4C81FE4",
      RESERVIOR_ADDRESS: "0x0AEfF3d761F6706295f3828C87ccE29c9418a93B",
      LUCKYBAGS_ADDRESS: "0x29b25f6d4AF89ABC26eB4187bC4DAAA4B9e3f012",
    },
    lps: [
      {
        address: "0x707b6f02ffc0c7fd9fe3a4f392aef47218021337",
        name: "BNB-TIFI",
        token0_name: "BNB",
        token0_address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        token1_name: "TIFI",
        token1_address: "0x17E65E6b9B166Fb8e7c59432F0db126711246BC0",
      },
      {
        address: "0x76fc4931d9d3a2054aee2d59633e49b759277d69",
        name: "BNB-BUSD",
        token0_name: "BNB",
        token0_address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        token1_name: "BUSD",
        token1_address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      },
      {
        address: "0x35bcB082347DC28D3B7E28AbD383aFE653A6DADA",
        name: "BNB-USDT",
        token0_name: "BNB",
        token0_address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        token1_name: "USDT",
        token1_address: "0x55d398326f99059fF775485246999027B3197955",
      },
      {
        address: "0xfeaCE6Ba3B5cDC9Bb045F95A588a1b3D09ab812A",
        name: "BNB-MFX",
        token0_name: "BNB",
        token0_address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        token1_name: "MFX",
        token1_address: "0x6266a18F1605DA94e8317232ffa634C74646ac40",
      }
    ]
  },

  TESTNET: {
    network_id: 97,
    explorer_url: 'https://testnet.bscscan.com',
    // rpc_url: 'https://data-seed-prebsc-2-s3.binance.org:8545/',
    rpc_url: 'https://data-seed-prebsc-2-s1.binance.org:8545',
    tokens: [
      {
        address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
        title: 'BNB',
        description: 'BNB',
        apiId: 'bnb',
        hasLendingPool: true,
        icon: bnb,
        value: 0
      },
      {
        address: '0x7d70fbc1A4593Cb12Cd4ABDED2839e4131D4950f',
        title: 'BUSD',
        description: 'BUSD Token',
        apiId: 'binance-usd',
        hasLendingPool: true,
        icon: busd,
        value: 0
      },
      {
        address: '0xEc9d9DD2e4a202aff885171192D6E091785d3487',
        title: 'TIFI',
        description: 'TiFi Token',
        apiId: 'tifi-token',
        hasLendingPool: true,
        icon: tifi,
        value: 0
      },
      {
        address: '0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684',
        title: 'USDT',
        description: 'Tether',
        apiId: 'tether',
        icon: usdt,
        value: 0
      },
      {
        address: "0x6266a18F1605DA94e8317232ffa634C74646ac40",
        title: "MFX",
        description: "MetFX Watch To Earn",
        apiId: "metfx-watch-to-earn",
        icon: mfx,
        value: 0
      }
    ],
    contracts: {
      GET_PRICE_ADDRESS: '0x309D76bBC369b54731c8Ded57ca1bD09D0072FD3',
      ROUTER_ADDRESS: '0x5B1E42d663B0c78b0a33731FdBD825BED47092E4',
      RESERVIOR_ADDRESS: '0x4f52C71283A88A298f4eb559874F1e2b194ddbdf',
      LUCKYBAGS_ADDRESS: '0xa8d065bC58dD4F004df222286101a72a02bE1dc1',
      LENDING_POOL_ADDRESS: '0xB0419a761b3f3d274C8b9Ca10C201c95Fa3F088d',
    },
    lps: [
      {
        address: '0xafc803d5318eF84AB2bc0c5bA0Bc08ACfD1c1438',
        name: 'BNB-TIFI',
        token0_name: 'BNB',
        token0_address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
        token1_name: 'TIFI',
        token1_address: '0xEc9d9DD2e4a202aff885171192D6E091785d3487',
      },
      {
        address: '0x64979533e19a0758EDFb0228b32b4Dc5C5B73038',
        name: 'BNB-BUSD',
        token0_name: 'BNB',
        token0_address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
        token1_name: 'BUSD',
        token1_address: '0x7d70fbc1A4593Cb12Cd4ABDED2839e4131D4950f',
      },
      {
        address: '0x8E055982e6C24F49B4C2faaaDC7d475c9cc36897',
        name: 'BNB-USDT',
        token0_name: 'BNB',
        token0_address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
        token1_name: 'USDT',
        token1_address: '0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684',
      },
    ],
  },
};

export const CHAIN_ID = ChainInfo[ENV].network_id;
export const TOKENS = ChainInfo[ENV].tokens;
export const RPC_URL = ChainInfo[ENV].rpc_url;
export const BSC_SCAN_URL = ChainInfo[ENV].explorer_url;
export const TIFI_ADDRESS = TOKENS[2].address;
export const WBNB_ADDRESS = TOKENS[0].address;
export const CONTRACT_ADDRESS = ChainInfo[ENV].contracts;
export const LP_TOKENS = ChainInfo[ENV].lps;
export const TOTAL_HOLDERS = "62,229"
export const NETWORK = {
  chainId: CHAIN_ID,
  _defaultProvider: (providers: any) => new providers.JsonRpcProvider(ChainInfo[ENV].rpc_url),
}

// Pool actions
export const PA_DEPOSIT = 1;
export const PA_WITHDRAW = 2;
export const PA_BORROW = 3;
export const PA_REPAY = 4;
export const PA_LIQUIDATE = 5;

// Wrap or Unwrap
export const WRAP = 1,
  UNWRAP = 2;

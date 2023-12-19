export const DEPLOYED_MARKETS: string[] = [];

export const DEPLOYED_DENOMS: string[] = [];

export const DEPLOYED_LEND_CONTRACTS: string[] = ['inj19q4flnf78evuhvzcfqhq8x9e800rjraj2whanu'];

export const GITHUB_REPOSITORY= "";
export const APP_NAME = "Yield Nest"
export const FEE_RECIPIENT = "inj19q4flnf78evuhvzcfqhq8x9e800rjraj2whanu";

// Context keys
export const WALLET_PROVIDER_CONTEXT_KEY = 'wallet-provider';


export const EXPLORER_LINKS = {
    TX: (hash: string) => `https://testnet.explorer.injective.network/transaction/${hash}/`,
    ACCOUNT: (address: string) => `https://testnet.explorer.injective.network/account/${address}/`
}


export const DENOMS_WE_CARE_ABOUT = ['factory/inj1m8vmsa84ha7up6cx3v7y7jj9egzl3u3vyzqml0/test_denom', "inj", "peggy0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5"] as const
export type CaredAboutDenoms = typeof DENOMS_WE_CARE_ABOUT[number]

export const DENOMS_INFO : Record<CaredAboutDenoms, {exponent: number, display: string; logo?: string}> = {
    "factory/inj1m8vmsa84ha7up6cx3v7y7jj9egzl3u3vyzqml0/test_denom" : {
        exponent: 6,
        display: "USDT_31DEC23",
    },
    "inj": {
        exponent: 18,
        display: "INJ",
        logo: "/logos/injective-v3.svg"
    },
    "peggy0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5": {
        exponent: 6,
        display: "USDT",
        logo: "/logos/usdt.svg"
    }
}

export const DEFAULT_LOGO = "/logos/cw20.svg"
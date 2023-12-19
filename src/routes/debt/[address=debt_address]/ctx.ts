import type { CaredAboutDenoms } from "$lib/constants";
import { getContext, setContext } from "svelte";


export const key = "LENDING_CONFIG";

/*
We need:
- target debt denom
- debt marketplace contract address
- collateral denom and info
*/

export interface DebtContext {
    debtDenom: CaredAboutDenoms
    contractAddress: string
    collateralDenom: CaredAboutDenoms
    debtMidPrice: number
    collateralMidPrice: number
}

export function setCtx(client: DebtContext){
    return setContext(key, client)
}


export function getCtx() {
    return getContext<DebtContext>(key);
}
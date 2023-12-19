/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.35.3.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export interface InstantiateMsg {
  collateral_ratio: string;
  liquidation_fee_pct: string;
}
export type ExecuteMsg = {
  mint: {
    quantity: Uint128;
    target_denom: string;
  };
} | {
  liquidate: {
    position_id: number;
  };
} | {
  repay: {
    position_id: number;
  };
} | {
  admin: AdminExecuteMsg;
};
export type Uint128 = string;
export type AdminExecuteMsg = {
  update_admin: {
    new_admin: string;
  };
} | {
  create_debt_token: {
    expiry: Timestamp;
    subdenom: string;
  };
} | {
  register_market: {
    base_currency: string;
    market_id: string;
    quote_currency: string;
  };
} | {
  mint_denom: {
    mint_data: Coin;
  };
};
export type Timestamp = Uint64;
export type Uint64 = string;
export interface Coin {
  amount: Uint128;
  denom: string;
  [k: string]: unknown;
}
export type QueryMsg = {
  get_admin: {};
} | {
  get_user_mint_positions: {
    user_address: Addr;
  };
} | {
  get_user_mint_positions_with_collateral_ratio: {
    user_address: Addr;
  };
} | {
  get_mint_position: {
    position_id: number;
  };
} | {
  get_batch_mint_positions: {
    count: number;
    start_id: number;
  };
} | {
  get_debt_tokens: {};
} | {
  get_protocol_settings: {};
} | {
  get_registered_markets: {};
};
export type Addr = string;
export interface GetAdminResponse {
  admin?: Addr | null;
}
export interface GetBatchMintPositionsResponse {
  positions: MintPositionRecordWithCollateralRatio[];
}
export interface MintPositionRecordWithCollateralRatio {
  collateral_asset: Coin;
  collateral_ratio: FPDecimal;
  minted_asset: Coin;
  minter: Addr;
  position_id: number;
  [k: string]: unknown;
}
export interface FPDecimal {
  num: string;
  sign: number;
  [k: string]: unknown;
}
export interface GetDebtTokensResponse {
  tokens: DebtTokenRecord[];
}
export interface DebtTokenRecord {
  denom: string;
  expiry: Timestamp;
  market_record: MarketRecord;
  [k: string]: unknown;
}
export interface MarketRecord {
  market_id: string;
  ticker: string;
  [k: string]: unknown;
}
export interface GetMintPositionResponse {
  position?: MintPositionRecordWithCollateralRatio | null;
}
export interface GetProtocolSettingsResponse {
  collateral_ratio: FPDecimal;
  liquidation_fee_pct: FPDecimal;
}
export interface GetRegisteredMarketsResponse {
  markets: RegisteredMarketRecord[];
}
export interface RegisteredMarketRecord {
  base_currency: string;
  market_id: string;
  quote_currency: string;
  [k: string]: unknown;
}
export interface GetUserMintPositionsResponse {
  mint_positions: MintPositionRecord[];
}
export interface MintPositionRecord {
  collateral_asset: Coin;
  minted_asset: Coin;
  [k: string]: unknown;
}
export interface GetUserMintPositionsWithCollateralRatioResponse {
  mint_positions: MintPositionRecordWithCollateralRatio[];
}
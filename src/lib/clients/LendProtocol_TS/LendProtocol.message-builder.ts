/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.35.3.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import type { InstantiateMsg, ExecuteMsg, Uint128, AdminExecuteMsg, Timestamp, Uint64, Coin, QueryMsg, Addr, GetAdminResponse, GetBatchMintPositionsResponse, MintPositionRecordWithCollateralRatio, FPDecimal, GetDebtTokensResponse, DebtTokenRecord, MarketRecord, GetMintPositionResponse, GetProtocolSettingsResponse, GetRegisteredMarketsResponse, RegisteredMarketRecord, GetUserMintPositionsResponse, MintPositionRecord, GetUserMintPositionsWithCollateralRatioResponse } from "./LendProtocol.types";
import type { CamelCasedProperties } from "type-fest";
export abstract class LendProtocolExecuteMsgBuilder {
  static mint = ({
    quantity,
    targetDenom
  }: CamelCasedProperties<Extract<ExecuteMsg, {
    mint: unknown;
  }>["mint"]>): ExecuteMsg => {
    return {
      mint: ({
        quantity,
        target_denom: targetDenom
      } as const)
    };
  };
  static liquidate = ({
    positionId
  }: CamelCasedProperties<Extract<ExecuteMsg, {
    liquidate: unknown;
  }>["liquidate"]>): ExecuteMsg => {
    return {
      liquidate: ({
        position_id: positionId
      } as const)
    };
  };
  static repay = ({
    positionId
  }: CamelCasedProperties<Extract<ExecuteMsg, {
    repay: unknown;
  }>["repay"]>): ExecuteMsg => {
    return {
      repay: ({
        position_id: positionId
      } as const)
    };
  };
  static admin = (adminExecuteMsg: AdminExecuteMsg): ExecuteMsg => {
    return {
      admin: adminExecuteMsg
    };
  };
}
export abstract class LendProtocolQueryMsgBuilder {
  static getAdmin = (): QueryMsg => {
    return {
      get_admin: ({} as const)
    };
  };
  static getUserMintPositions = ({
    userAddress
  }: CamelCasedProperties<Extract<QueryMsg, {
    get_user_mint_positions: unknown;
  }>["get_user_mint_positions"]>): QueryMsg => {
    return {
      get_user_mint_positions: ({
        user_address: userAddress
      } as const)
    };
  };
  static getUserMintPositionsWithCollateralRatio = ({
    userAddress
  }: CamelCasedProperties<Extract<QueryMsg, {
    get_user_mint_positions_with_collateral_ratio: unknown;
  }>["get_user_mint_positions_with_collateral_ratio"]>): QueryMsg => {
    return {
      get_user_mint_positions_with_collateral_ratio: ({
        user_address: userAddress
      } as const)
    };
  };
  static getMintPosition = ({
    positionId
  }: CamelCasedProperties<Extract<QueryMsg, {
    get_mint_position: unknown;
  }>["get_mint_position"]>): QueryMsg => {
    return {
      get_mint_position: ({
        position_id: positionId
      } as const)
    };
  };
  static getBatchMintPositions = ({
    count,
    startId
  }: CamelCasedProperties<Extract<QueryMsg, {
    get_batch_mint_positions: unknown;
  }>["get_batch_mint_positions"]>): QueryMsg => {
    return {
      get_batch_mint_positions: ({
        count,
        start_id: startId
      } as const)
    };
  };
  static getDebtTokens = (): QueryMsg => {
    return {
      get_debt_tokens: ({} as const)
    };
  };
  static getProtocolSettings = (): QueryMsg => {
    return {
      get_protocol_settings: ({} as const)
    };
  };
  static getRegisteredMarkets = (): QueryMsg => {
    return {
      get_registered_markets: ({} as const)
    };
  };
}
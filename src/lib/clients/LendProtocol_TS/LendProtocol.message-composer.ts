/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.35.3.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import  { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import  { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import  { toUtf8 } from "@cosmjs/encoding";
import type { InstantiateMsg, ExecuteMsg, Uint128, AdminExecuteMsg, Timestamp, Uint64, Coin, QueryMsg, Addr, GetAdminResponse, GetBatchMintPositionsResponse, MintPositionRecordWithCollateralRatio, FPDecimal, GetDebtTokensResponse, DebtTokenRecord, MarketRecord, GetMintPositionResponse, GetProtocolSettingsResponse, GetRegisteredMarketsResponse, RegisteredMarketRecord, GetUserMintPositionsResponse, MintPositionRecord, GetUserMintPositionsWithCollateralRatioResponse } from "./LendProtocol.types";
export interface LendProtocolMsg {
  contractAddress: string;
  sender: string;
  mint: ({
    quantity,
    targetDenom
  }: {
    quantity: Uint128;
    targetDenom: string;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  liquidate: ({
    positionId
  }: {
    positionId: number;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  repay: ({
    positionId
  }: {
    positionId: number;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  admin: (adminExecuteMsg: AdminExecuteMsg, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
}
export class LendProtocolMsgComposer implements LendProtocolMsg {
  sender: string;
  contractAddress: string;

  constructor(sender: string, contractAddress: string) {
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.mint = this.mint.bind(this);
    this.liquidate = this.liquidate.bind(this);
    this.repay = this.repay.bind(this);
    this.admin = this.admin.bind(this);
  }

  mint = ({
    quantity,
    targetDenom
  }: {
    quantity: Uint128;
    targetDenom: string;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          mint: {
            quantity,
            target_denom: targetDenom
          }
        })),
        funds: _funds
      })
    };
  };
  liquidate = ({
    positionId
  }: {
    positionId: number;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          liquidate: {
            position_id: positionId
          }
        })),
        funds: _funds
      })
    };
  };
  repay = ({
    positionId
  }: {
    positionId: number;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          repay: {
            position_id: positionId
          }
        })),
        funds: _funds
      })
    };
  };
  admin = (adminExecuteMsg: AdminExecuteMsg, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          admin: adminExecuteMsg
        })),
        funds: _funds
      })
    };
  };
}
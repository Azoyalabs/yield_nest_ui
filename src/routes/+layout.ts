import { Buffer } from 'buffer';
import Process from 'process';
globalThis.Buffer = Buffer;
globalThis.process = Process;

import type { LayoutLoad } from './$types';
import { getNetworkEndpoints, Network } from '@injectivelabs/networks';
import {
	ChainGrpcBankApi,
	ChainGrpcOracleApi,
	DenomClient,
	IndexerGrpcAccountPortfolioStream,
	IndexerGrpcOracleApi,
	IndexerGrpcOracleStream,
	IndexerGrpcSpotApi
} from '@injectivelabs/sdk-ts';
import { TokenFactory } from '@injectivelabs/token-metadata';
import { ChainGrpcExchangeApi } from '@injectivelabs/sdk-ts';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { DEPLOYED_LEND_CONTRACTS } from '$lib/constants';
import { LendProtocolQueryClient } from '$lib/clients/LendProtocol_TS/LendProtocol.client';

const network = Network.Testnet;
const endpoints = getNetworkEndpoints(network);

// const testnetIndexerEndpoint = "https://testnet.sentry.chain.grpc-web.injective.network";
// https://testnet.sentry.chain.grpc-web.injective.network/cosmos.bank.v1beta1.Query/DenomsMetadata

const testnetIndexerEndpoint = 'https://testnet.sentry.exchange.grpc-web.injective.network';

const bankModule = new ChainGrpcBankApi(endpoints.grpc);
const tokenFactory = TokenFactory.make(network);
const denomClient = new DenomClient(network);
const exchangeModule = new ChainGrpcExchangeApi(network);
const spotAPI = new IndexerGrpcSpotApi(testnetIndexerEndpoint); // NOTE: indexer is broken on testnet?

const accountPortfolioStreamer = new IndexerGrpcAccountPortfolioStream(testnetIndexerEndpoint);

const marketStreamer = new IndexerGrpcSpotApi(testnetIndexerEndpoint);
const oracleStreamer = new IndexerGrpcOracleStream(testnetIndexerEndpoint);
const oracleFetcher = new IndexerGrpcOracleApi(testnetIndexerEndpoint);


const modules = {
	bank: bankModule,
	tokens: tokenFactory,
	denoms: denomClient,
	exchange: exchangeModule,
	spotAPI,
	accountPortfolioStreamer: accountPortfolioStreamer,
	marketStreamer,
	oracleStreamer,
	oracleFetcher
};

export const load = (async () => {
	const cosmwasmClient = await CosmWasmClient.connect(endpoints.rpc!);

	// FIXME: this should be in root +page.ts
	const debtMarkets = await Promise.all(
		DEPLOYED_LEND_CONTRACTS.map(async (address) => {
			const client = new LendProtocolQueryClient(cosmwasmClient, address);

			const { markets } = await client.getRegisteredMarkets();

			const { buys, sells } = await modules.spotAPI.fetchOrderbookV2(markets[0].market_id);
			//console.dir(markets[0]);

			const highestBuy = parseFloat(
				buys.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))[0].price
			);
			const lowestSale = parseFloat(
				sells.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))[0].price
			);
			console.dir(highestBuy);
			//console.dir(lowestSale);



			return [address, markets[0], 1 - highestBuy];
		})
	);

	return {
		modules: { ...modules, cosmwasmClient },
		debtMarkets
	};
}) satisfies LayoutLoad;

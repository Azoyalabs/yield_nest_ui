import type { Coin } from '@injectivelabs/sdk-ts';
import type { PageLoad } from './$types';
import type { TokenInfo, TokenMeta } from '@injectivelabs/token-metadata';

//const chainGrpcBankApi = new ChainGrpcBankApi(endpoints.grpc);
export const load = (async ({ params, parent }) => {
	const cascade = await parent();

	// cascade.modules.exchange.fetchModuleState()
	
	const relevantMarkets = await cascade.modules.spotAPI.fetchMarkets({
		baseDenom: "factory/inj1m8vmsa84ha7up6cx3v7y7jj9egzl3u3vyzqml0/test_denom",
		// marketStatus: "",
		quoteDenom: "peggy0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5"
	})

	const marketID = '0xfd359c044664481b486665d3f7c5798faf6c2e5b88ca46399ddef71d9ee31fe3'
	
	const market = await cascade.modules.spotAPI.fetchMarket(marketID)
	//const relevantMarkets = await cascade.modules.spotAPI.fetchMarkets()


	const marketOrders = await cascade.modules.spotAPI.fetchOrderbookV2(marketID)

	//console.dir(marketOrders)

	const { balances } = await cascade.modules.bank.fetchBalances(params.address);
	/*
	const balancesWithTokenInfo = await Promise.all(
		balances.map(async (b) => {
			const tokenInfo = cascade.modules.tokens.toTokenInfo(b.denom);
			if (tokenInfo) {
				return { ...b, ...tokenInfo };
			} else {
				const tokenInfo = await cascade.modules.denoms.getDenomTokenInfo(b.denom);
				return { ...b, ...tokenInfo };
			}
		})
	);*/

	const knownTokens: (Coin & {meta: TokenMeta})[] = [];
	const unknownTokens: Coin[] = [];
	balances.forEach((b) => {
		const tokenInfo = cascade.modules.tokens.toTokenInfo(b.denom);
		if (tokenInfo) {
			const ret = { ...b, ...tokenInfo };
			knownTokens.push(ret);
		} else {
			unknownTokens.push(b);
		}
	});

	return {
		balances: {
			known: knownTokens,
			unknown: unknownTokens
		}
	};
}) satisfies PageLoad;

import type { LayoutLoad } from './$types';
import { LendProtocolQueryClient } from '$lib/clients/LendProtocol_TS/LendProtocol.client';
import { DEPLOYED_LEND_CONTRACTS } from '$lib/constants';

export const load = (async ({ parent }) => {
	const cascade = await parent();

	const client = new LendProtocolQueryClient(
		cascade.modules.cosmwasmClient,
		DEPLOYED_LEND_CONTRACTS[0]
	);

	const [injUSDTmarket] = await cascade.modules.spotAPI.fetchMarkets({
		baseDenom: "inj",
		quoteDenom: "peggy0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5"
	})

	const {buys: collateralBids, sells: collateralSells} = await cascade.modules.spotAPI.fetchOrderbookV2(injUSDTmarket.marketId)

	// 10^18 for inj, 10^-6 for usdt
	const collateralMidPrice = (parseFloat(collateralBids.at(0)!.price) + parseFloat(collateralSells.at(0)!.price))/2 * Math.pow(10,18)*Math.pow(10,-6)
	

	const settings = await client.getProtocolSettings();

	const { markets } = await client.getRegisteredMarkets();
	const market = markets[0];

	const { tokens } = await client.getDebtTokens();
	const [debtToken] = tokens;
	const denomMetadata = await cascade.modules.bank.fetchDenomMetadata(debtToken.denom);

	const { buys, sells } = await cascade.modules.spotAPI.fetchOrderbookV2(market.market_id);

	buys.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

	sells.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

	let midPointPrice = 0;
	if (buys.length > 0 && sells.length > 0) {
		midPointPrice = (parseFloat(buys[0].price) + parseFloat(sells[0].price)) / 2;
	}

	return {
		lendProtocol: {
			client,
			market,
			debtToken: {
				...debtToken,
				denomMetadata
			},
			midPrice: midPointPrice,
			settings,
			collateralMidPrice

		}
	};
}) satisfies LayoutLoad;

import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const cascade = await parent();


	

	const orderbook = await cascade.modules.spotAPI.fetchOrderbookV2(
		cascade.lendProtocol.market.market_id
	);

	const market = await cascade.modules.spotAPI.fetchMarket(cascade.lendProtocol.market.market_id);
	console.dir(market);

	const trades = await cascade.modules.spotAPI.fetchTrades({
		marketId: cascade.lendProtocol.market.market_id
	});

	const { positions: debtPositions } = await cascade.lendProtocol.client.getBatchMintPositions({
		count: 100,
		startId: 0
	});

	return {
		info: {
			...cascade.lendProtocol
		},
		market: {
			orderbook,
			trades,
			debts: debtPositions,
		}
	};
}) satisfies PageLoad;

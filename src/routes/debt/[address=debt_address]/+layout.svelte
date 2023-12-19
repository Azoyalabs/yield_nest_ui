<script lang="ts">
	import type { LayoutData } from './$types';
	import { setCtx } from './ctx';
	import type { CaredAboutDenoms } from '$lib/constants';

	export let data: LayoutData;

	setCtx({
		debtDenom: data.lendProtocol.debtToken.denom as CaredAboutDenoms,
		collateralDenom: 'inj',
		contractAddress: data.lendProtocol.client.contractAddress,
		debtMidPrice: data.lendProtocol.midPrice,
		collateralMidPrice: data.lendProtocol.collateralMidPrice
	});
</script>

<slot />

<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';

	import * as Stepper from '$lib/components/app/components/Stepper';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Percent } from 'lucide-svelte';
	import { getCtx } from './ctx';
	import Button from '$lib/components/ui/button/button.svelte';
	import { MESSAGE_BROADCASTER_STORE, USER_ADDRESS, USER_BALANCES } from '$lib/state/App';
	import { formatCurrency, formatCurrencyFull } from '$lib/formatters';
	import { derived } from 'svelte/store';
	import { LendProtocolExecuteMsgBuilder } from '$lib/clients/LendProtocol_TS/LendProtocol.message-builder';
	import {
		MsgCreateSpotMarketOrder,
		MsgExecuteContract,
		OrderTypeMap,
		getSubaccountId,
		type TxResponse
	} from '@injectivelabs/sdk-ts';
	import { DENOMS_INFO, EXPLORER_LINKS, FEE_RECIPIENT } from '$lib/constants';
	import type { Attribute } from '@cosmjs/cosmwasm-stargate';
	import { type Coin } from '@cosmjs/stargate';
	import Spinner from '$lib/components/app/molecules/Spinner/Spinner.svelte';

	export let maxCollateralRatio: string;
	export let marketID: string;

	const debtContext = getCtx();

	let value: string = '';

	let ltv: string = '50';
	let debtMintingPromise: Promise<TxResponse> | null = null;
	let debtSellingPromise: Promise<TxResponse> | null = null;

	$: parsedValue = (() => {
		const parsed = parseFloat(value);
		if (Number.isNaN(parsed)) {
			return 0;
		} else {
			return parsed;
		}
	})();

	function cleanUp() {
		debtMintingPromise = null;
		debtSellingPromise = null;
	}

	async function mintDebt() {
		const parsedCollateralAmount = parsedValue;
		// Its better to use toFixed() instead of toString(), The difference is that toString can convert large numbers to scientific notation
		const collateralAmount = Math.floor(parsedValue * Math.pow(10, 18)).toFixed(0);

		/*
		1- query midprice inj/usdt
2- usdt_value_collateral = inj_amount * midprice_inj_usdt
3- query midprice debt_usdt
4- amount_to_mint = (usdt_value_collateral / midprice_debt_usdt) * target_LTV_ratio
*/
		const collateralMidPrice = debtContext.collateralMidPrice;
		const collateralPriceAsUSD = collateralMidPrice * parsedCollateralAmount;
		console.log(collateralPriceAsUSD);

		const debtInfo = DENOMS_INFO[debtContext.debtDenom]!;

		const amountToMint = Math.floor(
			((collateralPriceAsUSD / debtContext.debtMidPrice) *
				parseInt(ltv) *
				Math.pow(10, debtInfo.exponent)) /
				100
		).toString();

		const mintMessage = LendProtocolExecuteMsgBuilder.mint({
			quantity: amountToMint,
			//targetDenom: 'factory/inj1m8vmsa84ha7up6cx3v7y7jj9egzl3u3vyzqml0/test_denom'
			targetDenom: debtContext.debtDenom
		});
		const mintExecuteMessage = MsgExecuteContract.fromJSON({
			// contractAddress: 'inj19q4flnf78evuhvzcfqhq8x9e800rjraj2whanu',
			contractAddress: debtContext.contractAddress,
			sender: $USER_ADDRESS!,
			msg: mintMessage,
			//funds: [{ denom: 'inj', amount: collateral }]
			funds: [{ denom: debtContext.collateralDenom, amount: collateralAmount }]
		});

		const broadcastMsg = await $MESSAGE_BROADCASTER_STORE!.broadcast({
			msgs: [mintExecuteMessage],
			address: $USER_ADDRESS!
		});

		console.log(broadcastMsg.txHash);
		/*
		const mintEvent = broadcastMsg.events
			?.find((e) => e.type === 'injective.tokenfactory.v1beta1.EventMintTFDenom')!
			.attributes.find((a: Attribute) => a.key === 'amount')!;

		console.dir(mintEvent);*/

		return broadcastMsg;
	}

	function getAmountFromMintEvents(events: { type: string; attributes: Attribute[] }[]): Coin {
		const mintEvent = events
			?.find((e) => e.type === 'injective.tokenfactory.v1beta1.EventMintTFDenom')!
			.attributes.find((a: Attribute) => a.key === 'amount')!;

		return JSON.parse(mintEvent.value);
	}

	async function marketSellDebt() {
		// FIXME: some stuff missing here
		// 1 - We need the amount here
		// 2 - we need the subaccount as well

		const createSpotOrder = MsgCreateSpotMarketOrder.fromJSON({
			feeRecipient: FEE_RECIPIENT,
			injectiveAddress: $USER_ADDRESS!,
			marketId: marketID,
			orderType: OrderTypeMap.SELL,
			// This is actually the worst price you are willing to sell to
			price: '0.01',
			// Not a 10^-6
			quantity: '10',
			subaccountId: getSubaccountId($USER_ADDRESS!)
		});

		const broadcastMsg = await $MESSAGE_BROADCASTER_STORE!.broadcast({
			msgs: [createSpotOrder],
			address: $USER_ADDRESS!
		});

		console.log(broadcastMsg.txHash);
		console.dir(broadcastMsg);

		return broadcastMsg;
	}

	const displayMaxCollateralRatio = parseFloat(maxCollateralRatio as unknown as string) * 100;

	const INJ_BALANCE = derived(USER_BALANCES, ($balances) => {
		return (
			$balances.find((b) => b.denom === 'inj') ?? {
				denom: 'inj',
				amount: '0'
			}
		);
	});
	const HUMAN_INJ_BALANCE = parseInt($INJ_BALANCE.amount) * Math.pow(10, -18);
</script>

<Dialog.Root
	onOpenChange={(visible) => {
		if (!visible) {
			cleanUp();
		}
	}}
>
	<Dialog.Trigger class="w-full py-2 text-sm bg-transparent border"
		>Open a new debt position</Dialog.Trigger
	>
	<Dialog.Content>
		<Stepper.Root class="relative">
			<Stepper.Progress />
			<Stepper.Content index={0}>
				<div class="flex-grow pb-8 space-y-6">
					<div>
						<h2 class="text-lg">Provide Collateral</h2>
						<p class="text-sm text-muted-foreground">
							This collateral will serve to back your debt position
						</p>
					</div>

					<div>
						<Label for="amount">Amount</Label>

						<div class="relative flex items-stretch flex-grow mt-1 focus-within:z-10">
							<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
								<img class="w-5 h-5" src="/logos/injective-v3.svg" alt="injective" />
							</div>
							<Input
								name="amount"
								type="number"
								bind:value
								step={Math.pow(10, -6).toString()}
								min={1}
								max={HUMAN_INJ_BALANCE}
								placeholder="0.01"
								class="pl-10"
							/>
						</div>
						<div class="mt-1 text-sm text-right text-muted-foreground">
							max: {formatCurrency(HUMAN_INJ_BALANCE)}
						</div>
					</div>

					<div>
						<Label for="ltv">Target LTV</Label>
						<div class="relative flex items-stretch flex-grow mt-1 focus-within:z-10">
							<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
								<Percent class="w-5 h-5 text-muted-foreground" />
							</div>
							<Input
								name="ltv"
								type="number"
								bind:value={ltv}
								min="50"
								max={displayMaxCollateralRatio}
								step="1"
								placeholder="50"
								class="pl-10 mt-1"
							/>
						</div>
						<p class="mt-1 text-xs text-muted-foreground">
							Your position is at risk of liquidation when your TVL reaches 70%.
						</p>
					</div>
				</div>

				<Stepper.Trigger locked={parsedValue === 0} />
			</Stepper.Content>

			<Stepper.Content index={1}>
				<div class="flex-grow pb-8 space-y-6">
					<div>
						<h2 class="text-lg">Mint the Debt Token</h2>
						<p class="text-sm text-muted-foreground">
							Lock up your collateral and open a debt position
						</p>
					</div>

					<div class="flex flex-col items-center w-full">
						{#if debtMintingPromise}
							{#await debtMintingPromise then resolved}
								{@const coin = getAmountFromMintEvents(resolved.events)}
								{@const info = DENOMS_INFO[coin.denom]}
								{@const parsedAmount = parseInt(coin.amount) * Math.pow(10, -info.exponent)}

								<div class="text-center">
									<div class="text-muted-foreground">
										You've minted
									</div>
									<div class="text-lg">
										{formatCurrencyFull(parsedAmount)}
										<span class="text-xs font-medium tracking-wide text-muted-foreground">
											{info.display}
										</span>
									</div>
								</div>

								<Button
									href={EXPLORER_LINKS.TX(resolved.txHash)}
									variant="outline"
									target="_blank"
									class="mt-5">View Transaction</Button
								>
							{/await}
						{/if}
					</div>
				</div>

				{#if debtMintingPromise}
					{#await debtMintingPromise}
						<div class="flex items-center justify-center w-full">
							<Spinner />
						</div>
					{:then resolvedMinting}
						<Stepper.Trigger />
					{:catch e}
						<div class="p-4 text-sm text-center border rounded-md border-red-500/40">
							{e}
						</div>
					{/await}
				{:else}
					<Button on:click={() => (debtMintingPromise = mintDebt())}>Mint Debt</Button>
				{/if}
			</Stepper.Content>

			<Stepper.Content index={2}>
				<div class="flex-grow pb-8 space-y-6">
					<div>
						<h2 class="text-lg">Sell on market</h2>
						<p class="text-sm text-muted-foreground">Exchange your debt tokens</p>
					</div>
					<div>get market orders (buy side) and compute an amount + rate from it?</div>
				</div>

				<Stepper.Trigger />
			</Stepper.Content>
			<Stepper.Content index={3}>
				<div class="flex-grow pb-8 space-y-6">
					<div>
						<h2 class="text-lg">Sell your debt on the market</h2>
						<p class="text-sm text-muted-foreground">Exchange your debt tokens</p>
					</div>

					<div>Your debt will be exchanged at market price</div>
					<div class="flex flex-col items-center w-full">
						{#if debtSellingPromise}
							{#await debtSellingPromise then resolved}

							<div class="text-center">
								<div class="text-muted-foreground">
									Success!
								</div>
							</div>
								<Button href={EXPLORER_LINKS.TX(resolved.txHash)} variant="outline" target="_blank"
									>View Transaction</Button
								>
							{/await}
						{/if}
					</div>
				</div>

				{#if debtSellingPromise}
					{#await debtSellingPromise}
						<div class="flex items-center justify-center w-full">
							<Spinner />
						</div>
					{:then resolvedSelling}
						<Stepper.Trigger />
					{:catch e}
						<div class="p-4 text-sm text-center border rounded-md border-red-500/40">
							{e}
						</div>
					{/await}
				{:else}
					<Button on:click={() => (debtSellingPromise = marketSellDebt())}>Sell Debt</Button>
				{/if}
			</Stepper.Content>
			<!-- 
			<Stepper.Content index={4}>
				<div class="flex-grow pb-8 space-y-6">
					<div>
						<div class="flex-grow pb-8 space-y-6">
							<div>
								<h2 class="text-lg">Success!</h2>
								<p class="text-sm text-muted-foreground">Exchange your debt tokens</p>
							</div>
					</div>

				</div>
			</Stepper.Content>
			 -->
		</Stepper.Root>
	</Dialog.Content>
</Dialog.Root>

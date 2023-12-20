<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { formatCurrency, formatCurrencyFull, formatPercent } from '$lib/formatters.js';
	import { IS_USER_CONNECTED, MESSAGE_BROADCASTER_STORE, USER_ADDRESS } from '$lib/state/App';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	import { ArrowUpRightSquare, Check, Cross, Crosshair } from 'lucide-svelte';
	import CreateDebtDialog from './createDebtDialog.svelte';
	import type { MintPositionRecordWithCollateralRatio } from '$lib/clients/LendProtocol_TS/LendProtocol.types';
	import Repay from '$lib/components/icons/Repay.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { LendProtocolExecuteMsgBuilder } from '$lib/clients/LendProtocol_TS/LendProtocol.message-builder';
	import { MsgExecuteContract } from '@injectivelabs/sdk-ts';
	import { invalidateAll } from '$app/navigation';
	import TransactionDialogContent from '$lib/components/app/components/TransactionDialog/TransactionDialogContent.svelte';
	export let data;

	let connectedUserMintPositions: MintPositionRecordWithCollateralRatio[] = [];

	async function refresh(address: string) {
		const { mint_positions } =
			await data.lendProtocol.client.getUserMintPositionsWithCollateralRatio({
				userAddress: address
			});
		connectedUserMintPositions = mint_positions;
	}
	USER_ADDRESS.subscribe(async (a) => {
		if (a) {
			refresh(a);
		} else {
			connectedUserMintPositions = [];
		}
	});

	async function reimburseDebt(positionID: number, toRepay: { denom: string; amount: string }) {
		const repayMsg = LendProtocolExecuteMsgBuilder.repay({
			positionId: positionID
		});

		const repayExecuteMessage = MsgExecuteContract.fromJSON({
			contractAddress: data.info.client.contractAddress,
			sender: $USER_ADDRESS!,
			msg: repayMsg,
			funds: [toRepay]
		});

		const broadcastMsg = await $MESSAGE_BROADCASTER_STORE!.broadcast({
			msgs: [repayExecuteMessage],
			address: $USER_ADDRESS!
		});

		invalidateAll();
		refresh($USER_ADDRESS!);

		return broadcastMsg;
	}

	async function LiquidateDebt(positionID: number, toRepay: { denom: string; amount: string }) {
		try {
			const repayMsg = LendProtocolExecuteMsgBuilder.liquidate({
				positionId: positionID
			});

			const repayExecuteMessage = MsgExecuteContract.fromJSON({
				contractAddress: data.info.client.contractAddress,
				sender: $USER_ADDRESS!,
				msg: repayMsg,
				funds: [toRepay]
			});

			const broadcastMsg = await $MESSAGE_BROADCASTER_STORE!.broadcast({
				msgs: [repayExecuteMessage],
				address: $USER_ADDRESS!
			});

			invalidateAll();
			refresh($USER_ADDRESS!);

			return broadcastMsg;
		} catch (error) {
			invalidateAll();
			refresh($USER_ADDRESS!);
			return null;
		}
	}
</script>

<div class="max-w-screen-xl px-4 mx-auto space-y-12 md:px-0">
	<div class="grid gap-6 md:grid-cols-2">
		<Card.Root class="">
			<Card.Header>
				<Card.Title>{data.info.debtToken.denomMetadata.display}</Card.Title>
				<Card.Description class="text-xs break-all">
					{data.info.debtToken.denomMetadata.base}
				</Card.Description>
			</Card.Header>
			<Card.Content class="flex-grow">
				<div>
					<h3>Market ID</h3>
					<span class="text-xs break-all">
						{data.info.market.market_id}
					</span>
				</div>
			</Card.Content>
			<Card.Footer class="grid grid-cols-2">
				<div class="space-y-1">
					<div class="text-xs font-semibold uppercase text-muted-foreground">Maximum LTV</div>
					<div>
						{formatPercent(parseFloat(data.info.settings.collateral_ratio))}
					</div>
				</div>

				<div class="space-y-1 text-right">
					<div class="text-xs font-semibold uppercase text-muted-foreground">Liquidator fee</div>
					<div>
						{formatPercent(parseFloat(data.info.settings.liquidation_fee_pct))}
					</div>
				</div>
			</Card.Footer>
		</Card.Root>

		<Card.Root class="">
			<Card.Header>
				<Card.Title>Market Status</Card.Title>
				<Card.Description class="text-xs">
					Current rates and liquidity condition at a glance
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid grid-cols-2 gap-6 py-2 text-left" >
					<div>

						<h3 class="text-xs text-muted-foreground">Market Sell At</h3>
						<div class="text-xl">
							{data.market.orderbook.buys[0].price}
						</div>
					</div>
					<div>

						<h3 class="text-xs text-muted-foreground">Market Buy At</h3>
						<div class="text-xl">
							{data.market.orderbook.sells[0].price}
						</div>
					</div>
				</div>
				<!-- 
				<div class="grid grid-cols-2 gap-6">
					<div>
						<h4 class="text-sm font-medium text-center uppercase text-foreground">Buy Orders</h4>
						<div class="flex items-center justify-between text-xs font-medium">
							<div>Price</div>
							<div>Quantity</div>
						</div>
						<ul id="buy-orders--container" class="text-sm divide-y md:text-base">
							{#each data.market.orderbook.buys as buy}
								<li class="flex items-center justify-between py-1">
									<div class="text-[--color]">
										{buy.price}
									</div>

									<div>
										{buy.quantity}
									</div>
								</li>
							{/each}
						</ul>
					</div>
					<div>
						<h4 class="text-sm font-medium text-center uppercase text-foreground">Sell Orders</h4>
						<div class="flex items-center justify-between text-xs font-medium">
							<div>Price</div>
							<div>Quantity</div>
						</div>
						<ul id="sell-orders--container" class="text-sm md:text-base">
							{#each data.market.orderbook.sells as sell}
								<li class="flex items-center justify-between py-1">
									<div class="text-[--color]">
										{sell.price}
									</div>

									<div>
										{sell.quantity}
									</div>
								</li>
							{/each}
						</ul>
					</div>
				</div> -->
			</Card.Content>
			<Card.Footer class="grid grid-cols-2">
				<div class="space-y-1">
					<div class="text-xs font-semibold uppercase text-muted-foreground">
						Implied Instant Minting Rate
					</div>
					<div>
						{formatPercent(1 - parseFloat(data.market.orderbook.buys[0].price))}
					</div>
				</div>

				<div class="space-y-1 text-right">
					<div class="text-xs font-semibold uppercase text-muted-foreground">Implied Rate</div>
					<div>
						{formatPercent(
							1 -
								(parseFloat(data.market.orderbook.buys[0].price) +
									parseFloat(data.market.orderbook.sells[0].price)) /
									2
						)}
					</div>
				</div>
			</Card.Footer>
		</Card.Root>

		<Card.Root class="md:col-span-2">
			<Card.Header>
				<Card.Title>Your Debt Positions</Card.Title>
				<Card.Description class="text-xs">
					Everything you need to know about your debt positions
				</Card.Description>
			</Card.Header>
			<Card.Content class="py-6">
				{#if $IS_USER_CONNECTED}
					<div>
						{#if connectedUserMintPositions.length > 0}
							<ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{#each connectedUserMintPositions as mintPosition}
									{@const isHealthy = parseFloat(mintPosition.collateral_ratio) < 0.7}
									{@const debtExponent = data.info.debtToken.denomMetadata.denomUnits.filter(
										(u) => u.exponent !== 0
									)[0].exponent}
									<li class="p-4 border rounded-md">
										<div class="flex items-center justify-between">
											<div>
												#{mintPosition.position_id}
											</div>
											<div class="text-xs">
												{formatPercent(parseFloat(mintPosition.collateral_ratio))} LTV
											</div>
										</div>
										<div class="mt-4">
											<div>
												{formatCurrency(
													parseInt(mintPosition.collateral_asset.amount) * Math.pow(10, -18)
												)}
												<span class="text-xs font-semibold uppercase text-muted-foreground">
													{mintPosition.collateral_asset.denom}
												</span>
											</div>
											<div class="text-lg">
												{formatCurrency(
													parseInt(mintPosition.minted_asset.amount) * Math.pow(10, -debtExponent)
												)}
												<span class="text-xs font-semibold uppercase text-muted-foreground">
													{data.info.debtToken.denomMetadata.display}
												</span>
											</div>
										</div>

										<div class="flex items-center justify-end">
											<Dialog.Root
												onOpenChange={() => {
													// FIXME: not enough to refresh, we need to handle the user's balance and debt positions. balances can be handled via a subscription + filter and patch method on balances. debt positions will have to be manually requeried
													invalidateAll();
												}}
											>
												<Dialog.Trigger
													class="{buttonVariants({
														variant: 'outline'
													})} space-x-2 bg-transparent"
												>
													<Repay />

													<span class="">Repay</span>
												</Dialog.Trigger>
												<Dialog.Content class="min-h-[260px]">
													<Dialog.Header>
														<Dialog.Title>
															Repay debt position #{mintPosition.position_id}</Dialog.Title
														>
														<Dialog.Description>
															Burn debt tokens to reimburse your debt
														</Dialog.Description>
													</Dialog.Header>
													<TransactionDialogContent
														action={() =>
															reimburseDebt(mintPosition.position_id, mintPosition.minted_asset)}
													>
														<div>
															Repay {formatCurrencyFull(
																parseInt(mintPosition.minted_asset.amount) *
																	Math.pow(10, -debtExponent)
															)}
															<span class="text-xs font-semibold uppercase">
																{data.info.debtToken.denomMetadata.display}
															</span>
														</div>

														<svelte:fragment slot="action">Repay Debt</svelte:fragment>
													</TransactionDialogContent>
												</Dialog.Content>
											</Dialog.Root>
										</div>
									</li>
								{/each}
							</ul>
						{:else}
							<span class="text-muted-foreground"> No open debt position found </span>
						{/if}
					</div>
				{:else}{/if}
			</Card.Content>
			<Card.Footer class="mt-6">
				{#if $IS_USER_CONNECTED}
					<CreateDebtDialog
						debtDenom={data.lendProtocol.debtToken.denom}
						maxCollateralRatio={data.lendProtocol.settings.collateral_ratio}
						marketBidOrders={data.market.orderbook.buys}
						marketID={data.info.market.market_id}
					/>
				{:else}
					<div class="text-muted-foreground">Connect your wallet to interact</div>
				{/if}
			</Card.Footer>
		</Card.Root>
	</div>

	<div>
		<h2 class="text-3xl font-semibold">Open Debt Positions</h2>

		<Table.Root class="mt-6">
			<Table.Header class="pointer-events-none">
				<Table.Row>
					<Table.Head class="w-[100px]">ID</Table.Head>
					<Table.Head>Collateral / Minted</Table.Head>
					<Table.Head>Owner</Table.Head>
					<Table.Head class="text-right">LTV (Health)</Table.Head>
					<Table.Head class="text-right">Action</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.market.debts as debtPosition (debtPosition.position_id)}
					{@const isHealthy = parseFloat(debtPosition.collateral_ratio) < 0.7}
					{@const debtExponent = data.info.debtToken.denomMetadata.denomUnits.filter(
						(u) => u.exponent !== 0
					)[0].exponent}
					<Table.Row>
						<Table.Cell class="font-medium">{debtPosition.position_id}</Table.Cell>
						<Table.Cell>
							<div class="text-lg">
								{formatCurrency(parseInt(debtPosition.collateral_asset.amount) * Math.pow(10, -18))}
								<span class="text-xs font-semibold uppercase text-muted-foreground">
									{debtPosition.collateral_asset.denom}
								</span>
							</div>
							<div class="text-lg">
								{formatCurrency(
									parseInt(debtPosition.minted_asset.amount) * Math.pow(10, -debtExponent)
								)}
								<span class="text-xs font-semibold uppercase text-muted-foreground">
									{data.info.debtToken.denomMetadata.display}
								</span>
							</div>
						</Table.Cell>
						<Table.Cell>{debtPosition.minter}</Table.Cell>
						<Table.Cell class="text-right ">
							<div class="flex items-center justify-end space-x-3">
								<span class="text-sm">
									{formatPercent(parseFloat(debtPosition.collateral_ratio))}
								</span>

								{#if isHealthy}
									<Check class="p-0.5 rounded-full bg-green-500/60" size="16" />
								{:else}
									<Cross class="p-0.5 rounded-full bg-red-500/60" size="16" />
								{/if}
							</div>
						</Table.Cell>
						<Dialog.Root
							onOpenChange={() => {
								// FIXME: not enough to refresh, we need to handle the user's balance and debt positions. balances can be handled via a subscription + filter and patch method on balances. debt positions will have to be manually requeried
								invalidateAll();
							}}
						>
							<Table.Cell class="text-right">
								<DropdownMenu.Root>
									<DropdownMenu.Trigger asChild let:builder>
										<Button
											builders={[builder]}
											variant="outline"
											size="icon"
											class="bg-transparent"
										>
											<ArrowUpRightSquare class="w-4 h-4" />
										</Button>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content class="w-56">
										<DropdownMenu.Label>Position</DropdownMenu.Label>
										<DropdownMenu.Separator />
										<DropdownMenu.Group>
											<DropdownMenu.Item disabled={isHealthy || $USER_ADDRESS === null}>
												<Dialog.Trigger
													class="flex items-center justify-start w-full py-0 space-x-2 bg-transparent border-none "
												>
													<Crosshair class="w-4 h-4 mr-2" />
													<span>Liquidate</span>
												</Dialog.Trigger>
											</DropdownMenu.Item>
										</DropdownMenu.Group>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</Table.Cell>

							<Dialog.Content class="min-h-[260px]">
								<Dialog.Header>
									<Dialog.Title>
										Liquidate debt position #{debtPosition.position_id}</Dialog.Title
									>
									<Dialog.Description>Liquidate a debt position</Dialog.Description>
								</Dialog.Header>
								<TransactionDialogContent
									action={() => LiquidateDebt(debtPosition.position_id, debtPosition.minted_asset)}
								>
									<div>
										Liquidate {formatCurrencyFull(
											parseInt(debtPosition.minted_asset.amount) * Math.pow(10, -debtExponent)
										)}
										<span class="text-xs font-semibold uppercase">
											{data.info.debtToken.denomMetadata.display}
										</span>
									</div>
									<div class="mt-4 text-sm">
										Get a {formatCurrency(
											parseInt(debtPosition.collateral_asset.amount) *
												Math.pow(10, -18) *
												parseFloat(data.info.settings.liquidation_fee_pct)
										)}
										<span class="text-xs font-semibold uppercase text-muted-foreground">
											{debtPosition.collateral_asset.denom}
										</span>
										liquidation fee ({formatPercent(
											parseFloat(data.info.settings.liquidation_fee_pct)
										)})
									</div>

									<svelte:fragment slot="action">Liquidate Debt</svelte:fragment>
								</TransactionDialogContent>
							</Dialog.Content>
						</Dialog.Root>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>

<style>
	#sell-orders--container {
		--color: red;
	}

	#buy-orders--container {
		--color: green;
	}
</style>

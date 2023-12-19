<script lang="ts">
	import { page } from '$app/stores';
	import * as Card from '$lib/components/ui/card';
	import { formatCurrency } from '$lib/formatters';
	import { LinkIcon } from 'lucide-svelte';
	export let data;

	let positions = [
		{
			id: 27,
			market: 'USDC-DEC-2023',
			// rate: 0.07,
			collateral: { amount: '100', denom: 'inj' },
			minted: { amount: '100', denom: 'factory:' }
		},
		{
			id: 32,
			market: 'USDC-JAN-2024',
			// rate: 0.07,
			collateral: { amount: '100', denom: 'inj' },
			minted: { amount: '100', denom: 'factory:' }
		}
	];
</script>

<div class="container py-12">
	<h1 class="text-3xl font-semibold">
		Portfolio - {$page.params.address}
	</h1>

	<section class="mt-12">
		<h2 class="text-xl font-medium">Balances</h2>
		<ul class="grid gap-4 mt-3">
			{#each data.balances.known as bal}
				{@const displayBalance = parseInt(bal.amount) * Math.pow(10, -bal.meta.decimals)}
				<li class="flex items-center p-4 space-x-4 border rounded-md">
					<div>
						<img
							src="/logos/{bal.meta.logo}"
							alt="{bal.meta.name} logo"
							width="30"
							height="30"
							class="rounded-full shadow-inner"
						/>
					</div>
					<div>
						{formatCurrency(displayBalance)}
						{bal.meta.symbol}
					</div>
				</li>
			{/each}
			{#each data.balances.unknown as bal}
				{@const displayBalance = parseInt(bal.amount) * Math.pow(10, -1)}
				<li class="flex items-center p-4 space-x-4 border rounded-md">
					<div>
						<img
							src="/logos/cw20.svg"
							alt="{bal.denom} logo"
							width="30"
							height="30"
							class="flex-grow-0 min-w-[30px] min-h-[30px] rounded-full shadow-inner aspect-square"
						/>
					</div>
					<div class="break-all">
						{formatCurrency(displayBalance)}
						{bal.denom}
					</div>
				</li>
			{/each}
		</ul>
	</section>

	<section class="mt-12">
		<h2 class="text-xl font-medium">Open Positions</h2>

		<ul class="grid gap-4 mt-3">
			{#each positions as position}
				<li class="w-full">
					<Card.Root>
						<Card.Header class="md:items-baseline md:justify-between md:flex-row">
							<Card.Title>
								{position.market}
							</Card.Title>
							<div>
								#{position.id}
							</div>
						</Card.Header>
						<Card.Content>content</Card.Content>
						<Card.Footer>View Position <LinkIcon size={16} class="ml-2" /></Card.Footer>
					</Card.Root>
				</li>
			{/each}
		</ul>
	</section>
</div>

<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { DEFAULT_LOGO, DENOMS_INFO, DEPLOYED_LEND_CONTRACTS } from '$lib/constants';
	import { formatPercent } from '$lib/formatters';
	import { ArrowRight, FileQuestion, HelpCircle } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	export let data;
</script>

<section class="container">
	<div class="py-24 text-center">
		<h1 class="text-4xl font-semibold uppercase font-grotesque">Zero coupon bonds-based lending</h1>
		<p class="mt-2">
			Mint interest-free bonds, and trade them for debt. Powered by the <i>Injective Testnet</i>
		</p>
	</div>
</section>
<section class="container mt-12">
	<h2 class="text-3xl font-medium">How does it work?</h2>
	<div class="grid gap-8 mt-5 lg:grid-cols-3">
		<Card.Root class="duration-300 bg-transparent shadow-inner ">
			<Card.Header>
				<Card.Title>
					<span
						class="block text-2xl font-normal h-[36px] w-[36px] bg-primary text-center rounded-xl"
					>
						1
					</span>
				</Card.Title>
				<Card.Description>Provide Collateral</Card.Description>
			</Card.Header>

			<Card.Content>Provide collateral and mint no-interest bonds</Card.Content>
		</Card.Root>
		<Card.Root class="duration-300 bg-transparent shadow-inner">
			<Card.Header>
				<Card.Title>
					<span
						class="block text-2xl font-normal h-[36px] w-[36px] bg-primary text-center rounded-xl"
					>
						2
					</span>
				</Card.Title>
				<Card.Description>Sell your bonds</Card.Description>
			</Card.Header>

			<Card.Content>Sell your bonds and obtain the tokens</Card.Content>
		</Card.Root>
		<Card.Root class="duration-300 bg-transparent shadow-inner">
			<Card.Header>
				<Card.Title>
					<span
						class="block text-2xl font-normal h-[36px] w-[36px] bg-primary text-center rounded-xl"
					>
						3
					</span>
				</Card.Title>
				<Card.Description>Reimburse at will</Card.Description>
			</Card.Header>

			<Card.Content>Repay as your go by buying bonds on the market and burning them</Card.Content>
		</Card.Root>
	</div>
</section>

<section class="container mt-24">
	<h2 class="text-3xl font-medium">How do I liquidate a position?</h2>

	<div class="grid gap-8 mt-5 lg:grid-cols-3">
		<Card.Root class="duration-300 bg-transparent shadow-inner ">
			<Card.Header>
				<Card.Title>
					<span
						class="block text-2xl font-normal h-[36px] w-[36px] bg-primary text-center rounded-xl"
					>
						1
					</span>
				</Card.Title>
				<Card.Description>Get the market's debt token</Card.Description>
			</Card.Header>

			<Card.Content>Buy debt on a Injective exchange</Card.Content>
		</Card.Root>

		<Card.Root class="duration-300 bg-transparent shadow-inner ">
			<Card.Header>
				<Card.Title>
					<span
						class="block text-2xl font-normal h-[36px] w-[36px] bg-primary text-center rounded-xl"
					>
						2
					</span>
				</Card.Title>
				<Card.Description>Find a liquidable position</Card.Description>
			</Card.Header>

			<Card.Content>A position with an LTV over the limit is liquidable</Card.Content>
		</Card.Root>

		<Card.Root class="duration-300 bg-transparent shadow-inner ">
			<Card.Header>
				<Card.Title>
					<span
						class="block text-2xl font-normal h-[36px] w-[36px] bg-primary text-center rounded-xl"
					>
						3
					</span>
				</Card.Title>
				<Card.Description>Liquidate the position</Card.Description>
			</Card.Header>

			<Card.Content
				>Liquidate and profit. Liquidators earn a fee on successful liquidations (Currently set to
				5%)</Card.Content
			>
		</Card.Root>
	</div>
</section>
<section class="container mt-24">
	<h2 class="text-3xl">Deployed Markets</h2>

	<ul class="grid grid-rows-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
		{#each data.debtMarkets as [contract, debt, marketRate]}
			{@const info = [debt.base_currency, debt.quote_currency].map((d) => DENOMS_INFO[d])}

			<a href="/debt/{contract}" class="group">
				<Card.Root class="h-full duration-300 group-hover:border-foreground">
					<Card.Header>
						<Card.Title>
							<div class="flex items-center">
								<div class="relative w-16 h-10">
									{#each info as d, i}
										<img
											src={d.logo ?? DEFAULT_LOGO}
											alt={d.display}
											class="absolute {i === 1 ? ' left-6' : ''} h-full py-0.5 aspect-square"
										/>
									{/each}
								</div>

								<div class="ml-2">
									{#each info as d, i}
										{#if i === 1}
											<span class="mx-1"> / </span>
										{/if}
										{d.display}
									{/each}
								</div>
							</div>
						</Card.Title>
						<Card.Description>Collateralized by INJ</Card.Description>
					</Card.Header>
					<Card.Content>
					</Card.Content>
					<Card.Footer class="grid grid-cols-2">
						<div class="space-y-0.5">
						<div class="text-xs font-semibold uppercase text-muted-foreground">
							Implied Market Minting Rate
						</div>
						<div>
							{formatPercent(marketRate)}
						</div>
					</div>
	<!-- 
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
					 -->
					</Card.Footer>
				</Card.Root>
			</a>
		{/each}

		<Card.Root class="duration-300 group-hover:border-foreground">
			<Card.Header>
				<Card.Title>More markets</Card.Title>
				<Card.Description>Your favourite collateral</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-col items-center justify-center text-muted-foreground">
				<HelpCircle size="32" />
				<Button href="https://twitter.com/AzoyaLabs" target="_blank" variant="outline" class="mt-3 text-xs" size="sm">Stay in touch</Button>
			</Card.Content>
		</Card.Root>
	</ul>
</section>

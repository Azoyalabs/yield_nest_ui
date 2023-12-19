<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { DEFAULT_LOGO, DENOMS_INFO, EXPLORER_LINKS, WALLET_PROVIDER_CONTEXT_KEY } from '$lib/constants';
	import * as Sheet from '$lib/components/ui/sheet';
	import type { WalletProviderContext } from '$lib/providers/WalletProvider/WalletProvider.svelte';
	import { getContext, onMount } from 'svelte';
	import type { ChainWalletBase, WalletStatus } from '@cosmos-kit/core';
	import { IS_USER_CONNECTED, USER_ADDRESS, USER_BALANCES, WALLET_STORE } from '$lib/state/App';
	import { wallets } from '$lib/wallets';
	import { Wallet } from '@injectivelabs/wallet-ts';
	import { ExternalLink } from 'lucide-svelte';
	import { formatCurrency, formatCurrencyFull } from '$lib/formatters';

	const walletProvider = getContext(WALLET_PROVIDER_CONTEXT_KEY) as WalletProviderContext;

	async function connectToWallet(wallet: Wallet) {
		walletProvider.connectWallet(wallet);
	}
</script>

<div class="flex flex-col">
	<Sheet.Header>
		<Sheet.Title>Your Wallet</Sheet.Title>
		<Sheet.Description>Your info and balances will show up here</Sheet.Description>
	</Sheet.Header>

	{#if $IS_USER_CONNECTED}
		<div class="py-4">
			<Button
				class="space-x-2 text-xs"
				variant="ghost"
				href="{EXPLORER_LINKS.ACCOUNT($USER_ADDRESS)}"
				target="_blank"
			>
				<span>
					{$USER_ADDRESS}
				</span>

				<ExternalLink size="14" />
			</Button>
			<div class="max-h-[300px] sm:max-h-none overflow-y-auto pb-4">
				<ul class="divide-y">
					{#each $USER_BALANCES as balance}
						{@const info = DENOMS_INFO[balance.denom]}
						{@const parsedAmount = parseInt(balance.amount) * Math.pow(10, -info.exponent)}
						<li class="flex items-center py-3 space-x-2 ">
							<img src={info.logo ?? DEFAULT_LOGO} alt={info.display} width="24" />
							<div>
								<div class="text-lg">
									{formatCurrencyFull(parsedAmount)}
								</div>
								<div class="text-xs font-medium tracking-wide text-muted-foreground">
									{info.display}
								</div>
							</div>
						</li>
					{/each}
				</ul>
			</div>

			<Sheet.Footer class="block">
				<Button variant="outline" class="block w-full" on:click={() => ($WALLET_STORE = null)}>
					<div class="text-xs">Disconnect</div>
				</Button>
			</Sheet.Footer>
		</div>
	{:else}
		<div class="grid gap-4 py-4">
			<div>
				<ul class="grid gap-4">
					{#each wallets as wallet}
						<Button
							variant="outline"
							class="w-full p-4"
							on:click={() => connectToWallet(wallet.name)}
						>
							<img src={wallet.logo} alt={wallet.label} class="w-6 h-6 mr-2 rounded-md" />
							<div class="text-sm">Connect to {wallet.label}</div>
						</Button>
					{/each}
				</ul>
			</div>
		</div>
	{/if}
</div>

<script lang="ts">
	import '../app.postcss';

	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';

	import { writable } from 'svelte/store';
	import WalletSheet from '$lib/components/app/molecules/WalletSheet/WalletSheet.svelte';
	import WalletProvider from '$lib/providers/WalletProvider/WalletProvider.svelte';
	import { IS_USER_CONNECTED, USER_ADDRESS, USER_BALANCES, WALLET_STORE } from '$lib/state/App';
	import { Github, WalletIcon } from 'lucide-svelte';
	import { navigating } from '$app/stores';
	import Spinner from '$lib/components/app/molecules/Spinner/Spinner.svelte';
	import { APP_NAME, DENOMS_WE_CARE_ABOUT, GITHUB_REPOSITORY } from '$lib/constants';
	import { wallets } from '$lib/wallets';

	export let data;

	USER_ADDRESS.subscribe(async (address) => {
		if (address) {
			const { balances } = await data.modules.bank.fetchBalances(address);
			// @ts-expect-error denoms are a subtype of string
			$USER_BALANCES = balances.filter((b) => DENOMS_WE_CARE_ABOUT.includes(b.denom));
		} else {
			$USER_BALANCES = [];
		}
	});

	const screenWidth = writable(0);
</script>

<!-- 
<div
	class="absolute top-0 bottom-0 left-0 right-0 z-0 pointer-events-none opacity-60"
	style="top: 0px; background: linear-gradient(180deg, rgba(123,97,255, 0.4) 0%, rgba(123,97,255, 0.2) 20%, rgba(var(--color-background-base), 0) 100%);"
>
	<div
		style="background-image: linear-gradient(270deg, rgb(var(--color-background-base)) 0%, rgba(var(--color-background-base), 0) 50%, rgb(var(--color-background-base)) 100%);"
	>
		<div class="h-[100vh]" />
	</div>
</div>
 -->
<div class="relative z-10 flex flex-col min-h-screen isolate">
	<WalletProvider>
		<header bind:clientWidth={$screenWidth} class="py-3 mb-6 border-b">
			<div class="container flex items-center justify-between">
				<a href="/" class="flex items-center space-x-2">
					<img src="/favicon.png" alt="logo" width="24" height="24" />
					<span class="font-semibold">{APP_NAME}</span>
				</a>
				<div>
					{#if $screenWidth > 600}
						<Sheet.Root>
							<Sheet.Trigger asChild let:builder>
								<Button
									builders={[builder]}
									variant="outline"
									size="icon"
									class="relative bg-transparent rounded-lg text-muted-foreground hover:text-foreground"
								>
									<WalletIcon />

									{#if $IS_USER_CONNECTED}
										{@const walletName = $WALLET_STORE?.wallet}
										{@const wallet = wallets.find((w) => w.name === walletName)}

										<img
											src={wallet?.logo}
											alt={wallet?.label}
											class="absolute w-6 rounded-full -bottom-2 -right-2"
										/>
									{/if}
								</Button>
							</Sheet.Trigger>
							<Sheet.Content side={'right'}>
								<WalletSheet />
							</Sheet.Content>
						</Sheet.Root>
					{:else}
						<Sheet.Root>
							<Sheet.Trigger asChild let:builder>
								<Button
									builders={[builder]}
									variant="outline"
									size="icon"
									class="relative bg-transparent rounded-lg text-muted-foreground hover:text-foreground"
								>
									<WalletIcon />
									{#if $IS_USER_CONNECTED}
										{@const walletName = $WALLET_STORE?.wallet}
										{@const wallet = wallets.find((w) => w.name === walletName)}

										<img
											src={wallet?.logo}
											alt={wallet?.label}
											class="absolute w-6 rounded-full -bottom-2 -right-2"
										/>
									{/if}
								</Button>
							</Sheet.Trigger>
							<Sheet.Content side={'bottom'}>
								<WalletSheet />
							</Sheet.Content>
						</Sheet.Root>
					{/if}
				</div>
			</div>
		</header>
		<div class="flex-grow pb-24">
			{#if $navigating}
				<div class="flex flex-col items-center justify-center min-h-screen">
					<Spinner />
				</div>
			{:else}
				<slot />
			{/if}
		</div>
	</WalletProvider>

	<footer class="relative z-10 py-3">
		<div class="flex items-center justify-center space-x-3">
			<Button href={GITHUB_REPOSITORY} size="icon" variant="outline">
				<Github />
			</Button>
		</div>
	</footer>
</div>

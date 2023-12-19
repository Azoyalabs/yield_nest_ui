<script lang="ts">
	import type { TxResponse } from '@injectivelabs/sdk-ts';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { EXPLORER_LINKS } from '$lib/constants';
	import Spinner from '../../molecules/Spinner/Spinner.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	let transactionPromise: Promise<TxResponse> | null = null;

	export let action: () => Promise<TxResponse>;
</script>

<div class="flex flex-col items-center justify-center">
	{#if transactionPromise}
		{#await transactionPromise}
			<!-- Sending Transaction... -->
			<Spinner />
		{:then resolvedRepayment}
			<div class="flex flex-col items-center w-full">
				<div class="text-center">
					<div class="text-muted-foreground">Success!</div>
				</div>
				<Button href={EXPLORER_LINKS.TX(resolvedRepayment.txHash)} target="_blank" variant="outline"
					>View Transaction</Button
				>
			</div>
		{:catch e}
			<div class="p-4 text-sm text-center border rounded-md border-red-500/40">
				{e}
			</div>
		{/await}
	{:else}
		<slot />
	{/if}
</div>

<Dialog.Footer>
	{#if !transactionPromise}
		<Button on:click={() => (transactionPromise = action())}>
			<!-- (transactionPromise = reimburseDebt(mintPosition.position_id, mintPosition.minted_asset)) -->
			<slot name="action">Send Transaction</slot>
		</Button>
	{/if}
</Dialog.Footer>

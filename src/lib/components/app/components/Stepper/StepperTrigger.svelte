<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { getCtx } from './ctx';

	const ctx = getCtx();
    export let locked: boolean = false;
</script>

{#if $ctx.steps > $ctx.progress + 1}
	<Button disabled={locked} on:click={() => ($ctx.progress += 1)}>Next</Button>
{/if}

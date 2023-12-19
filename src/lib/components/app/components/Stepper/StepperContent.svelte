<script lang="ts">
	import { cn } from '$lib/utils';

	import type { HTMLAttributes } from 'svelte/elements';
	import { getCtx } from './ctx';

	export let index: number;

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		index: number;
	};
	let className: $$Props['class'] = undefined;
	const ctx = getCtx();

	$ctx.steps++;
</script>

{#if $ctx.progress === index}
	<div class={cn('flex-grow flex flex-col p-4 min-h-[360px]', className)} {...$$restProps}>
		<slot />
	</div>
{/if}

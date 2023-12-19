<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';
	import { setCtx } from './ctx';
	import { writable } from 'svelte/store';

	let className: $$Props['class'] = undefined;

	type $$Props = HTMLAttributes<HTMLDivElement> & {};
	setCtx(writable({ progress: 0, locked: false, steps: 0 }));

	let locked = false;
</script>

<div
	class={cn(
		'flex flex-col min-h-[300px] relative overflow-hidden rounded-md overflow-hidden',
		className
	)}
	{...$$restProps}
>
	<slot {locked} />
</div>

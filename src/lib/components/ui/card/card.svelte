<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<div
	class={cn(
		"rounded-lg border text-card-foreground shadow-sm backdrop-blur-md",
		className
	)}
	{...$$restProps}
>
	<slot />
</div>

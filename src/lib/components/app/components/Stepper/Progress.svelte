<script lang="ts">
	import { getCtx } from './ctx';

	const ctx = getCtx();
</script>

<div class="fixed top-0 left-0 right-0 h-1">
	<div
		style=" width: {(($ctx.progress +
			1) /
			$ctx.steps) *
			100}%"
		class="h-full duration-300 rounded-full bg-primary"
	/>
</div>

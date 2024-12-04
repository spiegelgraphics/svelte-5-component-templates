<script>
	import { data } from '$stores/data.svelte.js';
	import TestUIButtons from '$components/TestUIButtons.svelte';
</script>


<div class="content">

	{#if data.loaded}
		<TestUIButtons {data} />
		<!-- TestAndereUiElemente -->
	{/if}

</div>


<style lang="scss">
	@use './../scss/config';

	.content {
		@include config.fontFamily(config.$spSans);
		margin: 1rem;
	}

</style>

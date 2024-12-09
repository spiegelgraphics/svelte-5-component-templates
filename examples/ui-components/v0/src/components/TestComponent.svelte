<script>
	let {
		name = 'Component',
		tip = '',
		children
	} = $props();
</script>

<div class="example-component">

	<div class="component-label">{name}</div>
	{#if tip}
		<div class="component-tip">{tip}</div>
	{/if}
	{@render children?.()}

</div>



<style lang="scss">
	@use "./../scss/config";

	.example-component {
		margin-bottom: 2rem;
	}

	.component-label {
		font-size: config.$font-size-l;
		@include config.fontFamily(config.$spSansBold);
		margin-bottom: 1rem;
	}

	.component-tip {
		@include config.fontFamily(config.$spSerif);
		margin-bottom: 1rem;
	}

</style>

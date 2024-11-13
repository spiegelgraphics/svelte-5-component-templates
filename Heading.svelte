<script>
  /**
     * @component
     * Heading component to display a title and an optional subtitle.
     *
     * @prop {string} title - The main title text to be displayed. Default is an empty string.
     * @prop {string} subtitle - The subtitle text to be displayed below the title. Default is an empty string.
     */
    
	const { title = '', subtitle = '' } = $props();
</script>

<div class="header">
	{#if title}
		<div class="title">{title}</div>
	{/if}
	{#if subtitle}
		<div class="subtitle">{subtitle}</div>
	{/if}
</div>

<style lang="scss">
	@use './../scss/config';

	.header {
		line-height: 1.1;
		margin-bottom: 0.75rem;
	}

	.title {
		@include config.fontFamily(config.$spSlab);
		font-size: 1.5rem;
		padding-bottom: 0.0625rem;
		@media screen and (max-width: 488px) {
			font-size: 1.25rem;
		}
	}

	.subtitle {
		font-size: 1rem;
	}
</style>
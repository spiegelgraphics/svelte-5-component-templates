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

<div class="heading">
	{#if title}
		<div class="title">{title}</div>
	{/if}
	{#if subtitle}
		<div class="subtitle">{subtitle}</div>
	{/if}
</div>

<style lang="scss">
	@use './../scss/config';

	.heading {
		margin-bottom: 0.75rem;
	}

	.title {
		@include config.fontFamily(config.$spSlab);
		font-size: 1.5rem;
		line-height: 1.1;
		@media screen and (max-width: 488px) {
			font-size: 1.25rem;
		}
	}

	.subtitle {
		padding-top: 0.375rem;
		font-size: 1rem;
		line-height: 1.2;
	}
</style>

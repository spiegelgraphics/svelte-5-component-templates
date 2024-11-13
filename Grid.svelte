<script>
  /**
     * @component Grid
     * 
     * This Svelte component creates a responsive grid layout.
     * It accepts children elements and renders them within a grid container.
     * The only restriction is the minimum column width.
     * 
     * @prop {HTMLElement} children - The child elements to be rendered inside the grid.
     * 
     * @example
     * <Grid>
     *   <div>Item 1</div>
     *   <div>Item 2</div>
     *   <div>Item 3</div>
     * </Grid>
     */

	const { children } = $props();
</script>

<div class="grid">
	{@render children?.()}
</div>

<style lang="scss">
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(var(--column-min-width, 300px), 100%), 1fr));
		column-gap: var(--column-gap, 1.5rem);
		row-gap: var(--row-gap, 1.5rem);
	}
</style>

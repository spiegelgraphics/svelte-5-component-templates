<script>
	/**
	 * @component Box
	 *
	 * This Svelte component renders a box used e.g. in Scroller.svelte with dynamic content and height.
	 * It accepts text content and the contentHeight of the application.
	 *
	 * @prop {string} text - The HTML text content to be rendered inside the box.
	 * @prop {number} contentHeight - The height of the visible viewport.
	 *
	 * @example
	 * <Box text="<strong>Hello, World!</strong>" contentHeight={store.contentHeight} />
	 */

	const { text, contentHeight } = $props();
</script>

<section style:--height="{0.01 * contentHeight}px">
	<div
		class="box"
		class:invisible={!text}
	>
		<p>
			{@html text}
		</p>
	</div>
</section>

<style lang="scss">
	section {
		--padding-top: 0;
		--scaleFactor: 1;
		width: 100%;
		padding-top: calc(var(--paddingTop, 50) * var(--height) * var(--scaleFactor));
		padding-bottom: calc(calc(100 - var(--paddingTop, 50)) * var(--height) * var(--scaleFactor));

		&:first-of-type {
			padding-top: calc(var(--paddingTop, 77) * var(--height));
			padding-bottom: calc(calc(100 - var(--paddingTop, 50)) * var(--height) * var(--scaleFactor));
		}

		&:last-of-type {
			padding-bottom: calc(80 * var(--height));
		}

		&.singleSection {
			padding-top: calc(50 * var(--height));
			padding-bottom: calc(50 * var(--height) * var(--scaleFactor));
		}
	}

	.box {
		width: 100%;
		margin: 0 auto;
		padding: 1.5rem 1rem;
		color: var(--int-font-color-default);
		font-size: 1.25rem;
		border: none;
		border-radius: 8px;
		box-sizing: border-box;
		user-select: none;
		background: var(--int-background-color-default-rgba-halftransparent);
		backdrop-filter: brightness(96%) blur(20px);
		-webkit-backdrop-filter: brightness(96%) blur(20px);

		@media (prefers-color-scheme: dark) {
			backdrop-filter: brightness(150%) blur(20px);
			-webkit-backdrop-filter: brightness(150%) blur(20px);
		}

		@media (min-width: 700px) {
			max-width: 555px;
		}

		&.invisible {
			visibility: hidden;
		}

		p {
			font-size: 18px;
			line-height: 1.3;

			:global(span) {
				font-style: normal;
				font-size: 18px;
				border: none;
				border-radius: 3px;
				padding: 0 2px;
				white-space: nowrap;
			}
		}
	}
</style>
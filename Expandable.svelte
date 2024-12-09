<script>
  /**
     * @component
     * Expandable component to manage expandable content with a maximum height.
     *
     * @prop {number} maxHeight - The maximum height of the content before it becomes expandable. Default is 300.
     * @prop {snippet} children - Snippet to render child components or content. Uses the default slot.
     */

	const { maxHeight = 300, children } = $props();

	const isIOS = !!navigator.platform.match(/iPhone|iPod|iPad/);

	let height = $state();
	let isExpanded = $state(false);

	let isExpandable = $derived(height && height > maxHeight);
</script>

<div
	class="expandable"
	class:is-expandable={isExpandable}
	class:is-expanded={isExpanded}
	style:--max-height="{maxHeight}px"
	bind:clientHeight={height}
>
	{@render children?.()}
	{#if isExpandable}
		{#if !isExpanded}
			<div class="expandable-fade"></div>
		{/if}
		<div
			class="expandable-button-container"
			class:is-expanded={isExpanded}
			class:is-ios={isIOS}
		>
			<button
				class:is-expanded={isExpanded}
				onclick={() => {
					isExpanded = !isExpanded;
				}}
				><span>{isExpanded ? 'Weniger anzeigen' : 'Mehr anzeigen'}</span><svg
					xmlns="http://www.w3.org/2000/svg"
					width="13"
					height="13"
					viewBox="0 0 13 13"
					fill="none"
					transform-origin="7.5 6.5"
					class:is-expanded={isExpanded}
				>
					<path
						d="M9.8313 4.65796L6.49797 7.99129L3.16463 4.65796"
						stroke="var(--int-font-color-default)"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg></button
			>
		</div>
	{/if}
</div>

<style lang="scss">
	.expandable {
		position: relative;

		&.is-expandable {
			max-height: calc(var(--max-height) + 1rem);
			overflow: hidden;

			&.is-expanded {
				max-height: unset;
				overflow: visible;
			}
		}

		.expandable-fade {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 4rem;
			background: linear-gradient(
				var(--int-background-color-default-rgba-transparent),
				var(--int-background-color-default)
			);
		}

		.expandable-button-container {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			display: flex;
			justify-content: center;
			padding: 1rem 0 0 0;

			&.is-expanded {
				position: sticky;
				padding: 1rem 0 1rem 0;

				&.is-ios {
					bottom: 3rem;
				}
			}

			button {
				display: flex;
				align-items: center;
				gap: 0.25rem;
				margin: 0;
				padding: 0.25rem 0.5rem;
				font-size: 1rem;
				border: 1px solid var(--int-font-color-shade-light);
				border-radius: 3px;
				background: var(--int-background-color-default);

				svg {
					margin: 1px 0 0 0;
					transform: rotate(0deg);
					transition: transform 0.2s;

					&.is-expanded {
						transform: rotate(180deg);
					}
				}
			}
		}
	}
</style>

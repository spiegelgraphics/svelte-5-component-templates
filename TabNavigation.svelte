<script>
	/**
	 * @component
	 * @description TabNavigation component renders a set of buttons based on the provided configuration.
	 * @prop {Array} items - An array of configuration objects for the buttons: [{label, index, ...anyFurtherData}].
	 * @prop {Object} currentTab - A bindable object with a default value containing the selected `activeItem`.
	 * @example
	 * example of items array:
	 * ```
	 *   const naviConfig = [
	 *     {label: 'Tab 1', index: 0, goodToKnow: {value: 'foo'}},
	 *     {label: 'Tab 2', index: 1},
	 *     {label: 'Tab 3', index: 2}
	 *   ];
	 * ```
	 * examples of currentTab object:
	 * ```
	 *   // first element shown as selected
	 *   let currentTab = $state(naviConfig[0]);
	 *   // no preselection, no active tab
	 *   let currentTab = $state({});
	 * ```
	 * @usage
	 * ```
	 *   <TabNavigation items={naviConfig} bind:currentTab />
	 * ```
	 */

	let {
		items,
		currentTab = $bindable({})
	} = $props();

	const handleButtonClick = (e) => {
		currentTab = e;
	};

</script>


<div class="btnBar">
	{#each items as item}
		{@const { label, index } = item}
		<button
			class="btn"
			class:active={index === currentTab.index}
			onclick={() => {
				handleButtonClick(item);
			}}
		>
			{label}
		</button>
	{/each}
</div>


<style lang="scss">

	@use "../scss/config";


	.btnBar {
		display: flex;
		flex-wrap: wrap;
		margin-top: 0.2rem !important;
		margin-bottom: 0.5rem !important;

		--color-enabled: #{config.$shade-darker};
		--color-hover: #{config.$shade-darker};
		--color-active: var(--int-font-color-default);
		--color-border-enabled: #{config.$shade-base};
		--color-border--hover: #{config.$shade-dark};
		--color-border--active: var(--int-font-color-default);

		@media screen and (prefers-color-scheme: dark) {

			--color-enabled: #{config.$grays-dark-base};
			--color-hover: #{config.$grays-dark-base};
			--color-active: var(--int-font-color-default);
			--color-border-enabled: #{config.$grays-dark-base};
			--color-border-hover: #{config.$grays-dark-base};
			--color-border-active: var(--int-font-color-default);

		}
	}

	.btn {
		margin-top: 0.5rem;
		padding: 0.35rem 1.25rem 6px;
		min-height: 29.2px;
		min-width: 33px;
		display: inline-block;
		text-align: center;
		white-space: nowrap;
		font-size: config.$font-size-m;
		line-height: 1;
		color: var(--color-enabled);
		background: transparent;
		border-width: 0;
		border-bottom-width: 1px;
		border-color: var(--color-border-enabled);

		&:hover {
			color: var(--color-hover);
			border-color: var(--color-border-enabled);
		}
	}

	.active {
		padding-bottom: 6px;
		cursor: default;
		pointer-events: none;
		color: var(--color-active);
		border-color: var(--color-border-active);
		border-bottom-width: 1px;
	}
</style>

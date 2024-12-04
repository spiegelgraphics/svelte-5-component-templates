<script>
	import { fade } from 'svelte/transition';

	/**
	 * @component
	 * ChoiceButtons
	 *
	 * A Svelte component that renders a list of options as buttons.
	 * Allows for single or multiple selections, and can render custom button content.
	 *
	 * Use CSS variables to customize the appearance of the buttons:
	 *  --button-gap: 14px;
	 * 	--button-gap-small: 4px;
	 * 	--button-color: var(--int-font-color-gray-base);
	 * 	--button-bg: var(--int-color-gray-fonds);
	 * 	--button-color-selected: #fff;
	 * 	--button-bg-selected: var(--int-font-color-link);
	 * 	--button-icon-color: none; // not used
	 * 	--button-icon-bg: var(--int-background-color-default);
	 * 	--button-icon-color-selected: var(--button-bg-selected, var(--int-font-color-link)
	 * 	--button-icon-bg-selected: #fff;
	 * 	--button-icon-border-color: var(--button-icon-border-color, var(--button-icon-bg, var(--int-background-color-default)));
	 * 	--button-icon-border-color-selected: var(--button-icon-bg-selected, #fff);
	 * 	--button-icon-border-width: 1px;
	 *
	 * @prop {Array} options - The list of options to display. Each option should be an object with `label` and `key` properties.
	 * @prop {Array} [selectedOptions=$bindable([])] - The list of initially selected options.
	 * @prop {Array} [disabledOptions=[]] - The list of disabled options.
	 * @prop {boolean} [isSmall=false] - If true, applies a smaller style to the buttons.
	 * @prop {boolean} [multipleChoice=true] - If true, allows multiple options to be selected.
	 * @prop {function (label: String, selected: boolean, disabled: boolean)} [optionRenderer=null] - Optional: Snippet, das den Button-Inhalt definiert.
	 *
	 */

	let {
		options,
		selectedOptions = $bindable([]),
		disabledOptions = [],
		isSmall,
		multipleChoice = true,
		optionRenderer
	} = $props();

	let disabledKeys = disabledOptions.map(d => d.key);
	let preselectedKeys = selectedOptions.map(d => d.key);
	let selectedKeys = $state(preselectedKeys);

	const selectOption = (e) => {
		if (multipleChoice) {
			if (selectedKeys.includes(e.key)) {
				selectedKeys = selectedKeys.filter(d => d !== e.key);
				selectedOptions = selectedOptions.filter(d => d.key !== e.key);
			} else {
				selectedKeys = [...selectedKeys, e.key];
				selectedOptions = [...selectedOptions, options.find(d => d.key === e.key)];
			}
		} else {
			selectedKeys = [e.key];
			selectedOptions = [options.find(d => d.key === e.key)];
		}
	};

</script>


{#snippet defaultButton(label, selected, disabled)}
	<div class="option" class:selected class:disabled>
		<span class="circle" class:selected>
			{#if selected}
				<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none"
				     transition:fade={{duration: 200}}>
					<path d="M8.33331 2L3.66665 8L1.66665 5.33333" stroke-width="2.2" stroke-linecap="round"
					      stroke-linejoin="round" />
				</svg>
			{/if}
		</span>
		<span>{label}</span>
	</div>
{/snippet}


<div class="options" class:isSmall>
	{#each options as { label, key } }
		{@const selected = selectedKeys.includes(key)}
		{@const disabled = disabledKeys.includes(key)}
		<button
			class:disabled
			onclick={disabled? null : () => selectOption({key}) }
		>
			{@render (optionRenderer || defaultButton)(label, selected, disabled)}
		</button>
	{/each}
</div>


<style lang="scss">

	button.disabled {
		pointer-events: none;
	}

	.options {
		display: flex;
		position: relative;
		height: auto;
		border-radius: 18px;
		width: 100%;
		flex-direction: row;
		gap: var(--button-gap, 14px);

		button {
			flex: 1;
		}

		&.isSmall {
			flex-direction: column;
			gap: var(--button-gab-small,  4px);
		}
	}

	.option {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		cursor: pointer;
		transition: all 0.4s;
		color: var(--button-color, var(--int-font-color-gray-base));
		font-weight: 700;
		font-size: 18px;
		border-radius: 18px;
		background-color: var(--button-bg, var(--int-color-gray-fonds));
		padding: 0 9px 0 7px;
		min-height: 36px;

		&.selected {
			color: var(--button-color-selected, #fff);
			background-color: var(--button-bg-selected, var(--int-font-color-link));
		}

		span {
			z-index: 4;
		}

		.circle {
			width: 18px;
			height: 18px;
			border-radius: 50%;
			background-color: var(--button-icon-bg, var(--int-background-color-default));
			margin-right: 7px;
			border: var(--button-icon-border-width, 1px) solid var(--button-icon-border-color, var(--button-icon-bg, var(--int-background-color-default)));
			position: relative;
			transition: all 0.4s;

			&.selected {
				border: var(--button-icon-border-width, 1px) solid var(--button-icon-border-color-selected, var(--button-icon-bg-selected, #fff));
				background-color: var(--button-icon-bg-selected, #fff);

				svg {
					position: absolute;
					top: 4px;
					left: 4px;

					path {
						stroke: var(--button-icon-color-selected, var(--button-bg-selected, var(--int-font-color-link)));
					}
				}
			}
		}
	}

</style>

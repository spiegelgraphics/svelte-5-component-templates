<script>
	/**
	 * @component
	 * AutocompleteSearch
	 * 
	 * A searchable dropdown component with autocomplete functionality that filters items in real-time.
	 * Supports keyboard navigation, custom styling, and optional search string persistence.
	 * 
	 * @prop {String} selectLabel - Optional label displayed above the input field. Default: ''
	 * @prop {String} itemLabelKey - The key in the item object to use as the display label. Default: 'key'
	 * @prop {Array} items - The list of items to search through. Each item can have a `select_label` or will use the `itemLabelKey` property.
	 * @prop {String} placeholder - Placeholder text for the search input. Default: 'Suche ...'
	 * @prop {Boolean} disabled - If true, disables the input field and prevents interaction.
	 * @prop {Boolean} keepSearchString - If true, retains the search string after selection. Default: true
	 * @prop {Number} maxAutocompleteLength - Maximum number of items to display in the dropdown. Default: 2000
	 * @prop {Number} maxAutocompleteHeight - Maximum height of the dropdown list in pixels (4 items without scrollbar). Default: 204
	 * @prop {Object} selectedItem - The currently selected item. This is a bindable property that updates when an item is selected.
	 * 
	 * />
	 */

	import { onMount } from 'svelte';
	import { clickOutside } from '$actions/outsideClickable.js';

	let {
		// showSelectLabel = false,
		selectLabel = '',
		itemLabelKey = 'key',
		items: itemInput = [],
		placeholder = 'Suche ...',
		disabled,
		keepSearchString = true,
		maxAutocompleteLength = 2000,
		maxAutocompleteHeight = 204, // entspricht 4 Einträgen ohne Scrollbar
		selectedItem = $bindable()
	} = $props();

	let keepListOpen = $state(false);


	// original-daten in "item" verpacken,
	// und um zusätzliche, interne Werte erweitern
	const items = $derived(itemInput.map((item, i) => {
		return {
			item: {
				...item
			},
			select_label: item.select_label || item[itemLabelKey],
			list_index: i,
		}
	}));


	let textbox = null;
	let autocompleteBox = null;

	let searchString = $state('');
	// let searchInputHasFocus = $state(false);
	let autocompleteVisible = $state(false);
	let activeListIndex = $state(0);

	// let start = $state(0);
	// let end = $state(0);
	let scrollToIndex = $state(0);

	// let message = $state(null);
	// const currentURL = encodeURIComponent(window.location.href);

	let filteredList = $derived.by(() => {
		if (searchString?.trim().length > 0) {
			const searchWords = searchString.toLowerCase().split(/\s+/);
			return items.filter(item => {
				// console.log("--item", item)
				const { search_string, select_label } = item;
				const itemWords = (search_string + ' ' + select_label).toLowerCase().split(/\s+/);
				return searchWords.every(word => itemWords.some(itemWord => itemWord.includes(word)));
			});
		}
		return items;
	});

	const elemIsVisible = (elem) => {
		const rect = elem.getBoundingClientRect();
		const autocompleteBoxRect = autocompleteBox.getBoundingClientRect();
		return (
			rect.top >= autocompleteBoxRect.top &&
			rect.bottom <= autocompleteBoxRect.bottom
		);
	}

	const resetInput = () => {
		searchString = '';
		activeListIndex = 0;
		scrollToIndex = 0;
		autocompleteBox.scrollTop = 0;
	};

	const handleKey = (e, item) => {

		if (e.key === 'ArrowDown') {
			activeListIndex = Math.min(activeListIndex + 1, filteredList.length - 1);
			if (!elemIsVisible(autocompleteBox.children[activeListIndex])) {
				autocompleteBox.children[activeListIndex].scrollIntoView({ block: 'nearest' });
			}
		} else if (e.key === 'ArrowUp') {
			activeListIndex = Math.max(activeListIndex - 1, 0);
			if (!elemIsVisible(autocompleteBox.children[activeListIndex])) {
				autocompleteBox.children[activeListIndex].scrollIntoView({ block: 'nearest' });
			}
		} else if (e.key === 'Enter') {
			e.preventDefault();
			e.stopPropagation();
			e.target.blur();

			selectedItem = filteredList[activeListIndex]; 

			searchString = '';
			activeListIndex = 0;
			autocompleteBox.scrollTop = 0;

			autocompleteVisible = false;

		} else if (e.key === 'Escape') {
			e.preventDefault();
			e.stopPropagation();
			e.target.blur();
			resetInput();
			autocompleteVisible = false;
		} else {
			activeListIndex = 0;
			scrollToIndex = 0;
			autocompleteBox.scrollTop = 0;
		}
	};

	const handleClick = (e) => {

		selectedItem = e;

		if(!keepSearchString) {
			resetInput();
		} else {
			searchString = e.select_label;
			activeListIndex = e.list_index
		}

		autocompleteVisible = keepListOpen;

	};

	/*const handleListScroll = (e) => {
		start = e.start;
		end = e.end;
	};*/

	const handleClickOutside = (e) => {
		autocompleteVisible = false;
		autocompleteBox.scrollTop = 0;
		searchString = !keepSearchString? '' : selectedItem?.select_label || '';
	};

	const handleFocus = () => {
		searchString =  ''; //!keepSearchString? '' : selectedItem?.select_label || "";
		autocompleteVisible = true;
		// console.log("keepSearchString", keepSearchString, selectedItem);
		if(!keepSearchString) {
			selectedItem = null;
		}
	};

	const clearInput = (e) => {
		e.preventDefault();
		e.stopPropagation();
		resetInput();
		selectedItem = null;
		console.log('%c alles clear ', 'background:red;color:white');

		autocompleteVisible = true;
		textbox.disabled = false;
		textbox.readOnly = false;
		textbox.focus();
	}


	/*$effect(() => {

		// searchString = "";

		// if (selectedItem /!*|| currentMember?.selectedMember*!/) {
		//
		// 	// searchString = selectedItem?.select_label || "";
		// 	searchString = /!*currentMember?.selectedMember ? currentMember?.selectedMember.select_label || '' :*!/ selectedItem?.select_label || '';
		// 	// prevSelectedItem = selectedItem;
		// } else {
		// 	searchString = '';
		// }
	});*/

	const openList = $derived(autocompleteVisible);

	onMount(() => {
		autocompleteBox.scrollTop = 0;
	});

	//  use:clickOutside={handleClickOutside}>

</script>

<div class="autocomplete-select" use:clickOutside={handleClickOutside}>
	{#if selectLabel}
		<div class="label">{selectLabel}</div>
	{/if}
	<div class="autocomplete-input"
	     class:disabled={disabled}
	     onclick={() => textbox.focus()}
	     onkeydown={(e) => e.key === 'Enter' && textbox.focus()}
	     role="button"
	     tabindex="0"
	>
		<!-- || !currentMember?.selectedMember?.select_label -->
		{#if !selectedItem  || searchString === ""}
			<svg class="icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
				<circle cx="6" cy="6" r="5.35" stroke-width="1.3" />
				<path d="M10 10L14.5 14.5" stroke-width="1.3" stroke-linecap="round" />
			</svg>
		{/if}
		<div class="input-wrapper"
		     class:open={!!selectedItem}
		     style:background-color={!!selectedItem? 'transparent' : 'transparent'}
		     role="button"
		     tabindex="0"
		>
			<!--
				//disabled={!!selectedItem}
				//readonly={!!selectedItem}
			-->
			<input
				type="text"
				{disabled}
				placeholder={placeholder}
				class:active={!!selectedItem}
				bind:value={searchString}
				bind:this={textbox}
				onfocus={handleFocus}
				onkeydown={handleKey}
			/>
			<!-- && currentMember?.selectedMember?.select_label && searchString !== "" -->
			{#if selectedItem && searchString !== ""}
				<div class="clear-icon">
					<svg width="16px" height="15px"
					     focusable="false"
					     aria-hidden="true"
					     role="presentation"
					     onclick={clearInput}
					>
						<path d="M12 12.5L4.00002 4.5M12 4.5L4.00002 12.5" stroke-linecap="round" />
					</svg>
				</div>
			{/if}
		</div>
	</div>
	<div class="autocomplete-box"
	     class:open={openList}
	     style="max-height: {maxAutocompleteHeight}px"
	     bind:this={autocompleteBox}>
		{#each filteredList.slice(0, maxAutocompleteLength) as item, i}
			<div class="list-item"
			     role="option"
			     tabindex="0"
			     onmousedown={() => handleClick(item)}
			     onkeyup={(e) => handleKey(e, item)}
			     class:active={i === activeListIndex}
			     aria-selected={i === activeListIndex}>
				{item.select_label}
			</div>
		{/each}
	</div>
</div>


<style lang="scss">

	@use './../../scss/config' as config;

	.label {
		font-weight: 700;
		padding-bottom: 1rem;
	}

	.autocomplete-select {
		position: relative;
		z-index: 19 !important;
		width: 100%;
        max-width: 520px;
		@include config.fontFamily(config.$spSans);

		--int-search-background: var(--int-background-color-default);
	}

	.autocomplete-input {
		display: flex;
		width: 100%;
		box-sizing: border-box;
		flex-direction: row-reverse;
		align-items: center;
		border: 1px solid var(--int-font-color-shade-light);
		height: 48px;
		padding: 0.875rem 0.75rem 0.875rem 0.625rem;
		gap: 0.75rem;
		border-radius: 1.5px;
		cursor: text;
		line-height: 1.26;
		user-select: none;
	}

	.autocomplete-input:hover:not(:has(input:focus)) {
		border: 1px solid var(--int-font-color-shade-dark);
		border-radius: 1.5px 1.5px 0 0;
	}

	.autocomplete-input.disabled {
		border-color: var(--int-font-color-shade-lightest);
		pointer-events: none;

		.icon path,
		.icon circle {
			stroke: var(--int-font-color-shade-dark);
		}
	}

	.input-wrapper {
		display: inline-flex;
		width: 100%;
		align-items: center;
		position: relative;
		color: var(--int-font-color-default);
	}

	.input-wrapper.open {
		// display: flex;
		align-items: center;
		// width: auto;
		max-width: 100%;
		color: var(--int-font-color-default);
		border: 0;
		border-radius: 1.5px;
	}

	.autocomplete-input input[type=text] {
		flex: 1;
		min-width: 0;
		width: auto;
		border: 0;
		outline: 0;
		background-color: transparent;
		font-size: config.$font-size-m;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		color: var(--int-font-color-default);
		opacity: 1;
		user-select: none;
	}

	.autocomplete-input svg.icon circle, .autocomplete-input svg.icon path {
		stroke: var(--int-font-color-default);
	}

	.clear-icon {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		cursor: pointer;
		stroke: var(--int-font-color-default);
		margin: 0;
		flex-shrink: 0;
		width: 40px;
		height: 30px;
	}

	.autocomplete-box {
		border: 1px solid var(--duv-ui-regular-border-enabled);
		border-top: none;
		border-radius: 0 0 1.5px 1.5px;
		background: var(--int-search-background);
		width: 100%;
		position: absolute;
		left: 0;
		top: 100%;
		display: none;
		overflow-y: scroll;
		transform: translateY(-1px);
		border: 1px solid var(--int-font-color-shade-light);
	}

	.autocomplete-box.open {
		display: block;
	}


	.list-item {
		padding: 1rem 1rem 1rem 0.6125rem;
		cursor: pointer;
		font-size: config.$font-size-m;
	}

	.list-item.active,
	.list-item:hover, .list-item:focus {
		background-color: var(--int-font-color-shade-lightest);
		color: var(--int-font-color-default);
		outline: none;
		font-weight: 700;
	}
</style>

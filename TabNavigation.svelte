<script>
	/**
	 * @component
	 * @name TabNavigation
	 * @description A tab navigation component allowing horizontal scrolling and tab selection.
	 * @example
	 * <TabNavigation title="My Tabs" tabs={[{name: 'Tab 1', detail: {x: 0}}, {name: 'Tab 2'}]} indexStartTab={0} />
	 *
	 * @prop {string} title - The (optional) title of the tab navigation.
	 * @prop {Array} tabs - An array of tab objects. Each object should have a `name` or `label` property.
	 * @prop {number} indexStartTab - The index of the initially selected tab.
	 * @prop {Object} selectedTab - Selected tab object from tabs Array. Default: bindable().
	 *
	 * Dependencies: actions/dragscrollable.js and _ui.css-vars.scss
	 */

	import { dragscrollable, isTouchDevice } from '$actions/dragscrollable.js';
	import { onMount } from 'svelte';


	let {
		title = '',
		tabs,
		indexStartTab = 0,
		selectedTab = $bindable()
	} = $props();

	const borderPadding = {
		vertical: 0,
		horizontal: 4
	};

	const tabNaviData = tabs.map((item, index) => {
		const label = item.label || item.name || (typeof item === 'string' ? item : 'Tab ' + index)
		return {
			__id: 'tab-navi-' + (Date.now() + label.length) + '-' + Math.round(Math.random() * 100000) + '-' + index,
			...item,
			label,
			index
		};
	});

	selectedTab = tabNaviData[indexStartTab] || tabNaviData[0];

	const labelWidths = $state([]);
	let tabList = $state({});
	let elementClickable = $state(true);

	let scrollLeft = $state(0);
	const scrollRight = $derived(tabList.scrollWidth - tabList.clientWidth - scrollLeft);
	const showFadeLeft = $derived(Math.floor(scrollLeft) > 1);
	const showFadeRight = $derived(Math.floor(scrollRight) > 1);
	const activeLabelWidth = $derived.by(() => {
		if (
			!tabNaviData ||
			labelWidths.length !== tabNaviData.length
		)
			return;
		return labelWidths[selectedTab.index];
	});

	const translateX = $derived.by(() => {
		if (!activeLabelWidth) return;
		const totalWidth = labelWidths
			.slice(0, selectedTab.index)
			.reduce((acc, cur) => acc + cur, 0);
		return (
			totalWidth + selectedTab.index * borderPadding.horizontal * 2
		);
	});

	const setAvailableScrollSpace = () => {
		// scrollLeft setzen; update für scrollRight und showFadeLeft/Right via $derived
		scrollLeft = tabList.scrollLeft > 1 ? tabList.scrollLeft : 0;
	};

	const centerActiveTab = (activeTabId) => {

		// console.log('%c activeTab-ID ', 'background:red;color:white', activeTabId);
		const activeTabElement = tabList?.querySelector(`li[data-aid="${activeTabId}"]`);

		if (activeTabElement) {
			const tabListWidth = tabList.clientWidth;
			const tabListScrollWidth = tabList.scrollWidth;
			const activeTabLeft = activeTabElement.offsetLeft;
			const activeTabWidth = activeTabElement.clientWidth;
			const activeTabCenter = activeTabLeft + activeTabWidth / 2;
			const scrollPosition = activeTabCenter - tabListWidth / 2;
			const maxScrollLeft = tabListScrollWidth - tabListWidth;
			scrollLeft = selectedTab.index === 0 ? 0 : Math.max(0, Math.min(scrollPosition, maxScrollLeft));

			tabList.scrollTo({
				left: Math.max(0, Math.min(scrollPosition, scrollLeft)),
				behavior: 'smooth'
			});

			// In certain configurations, the right frame line is not fully displayed
			// → Adjust the value of “left” for “scrollTo”
			const isLastTabActive = activeTabElement.classList.contains('last');
			if (isLastTabActive) {
				setTimeout(() => {
					tabList.scrollTo({
						left: tabListScrollWidth - 1, // -1 to prevent to cut the right-hand frame line
						behavior: 'smooth'
					});
				}, 299);
			}

		}
	};

	onMount(() => {
		setAvailableScrollSpace();
	});

</script>

<div class="tab-navigation">

	{#if title}
		<div class="title">{title}</div>
	{/if}

	<div class="tabs-bar">

		{#if showFadeRight}
			<div class="fade right"></div>
		{/if}
		{#if showFadeLeft }
			<div class="fade left"></div>
		{/if}

		<div
			class="tabs-switch"
			bind:this={tabList}
			use:dragscrollable={{
				axis: 'x',
				cursor: false,
				dragging: () => {
					setAvailableScrollSpace();
					// Prevent click event while dragging on non-touch devices only;
					// touch devices don't need this, and the reset to clickable wouldn't work properly.
					elementClickable = isTouchDevice;
				},
				draggingEnd: () => {
					window.setTimeout(() => {
						setAvailableScrollSpace();
						elementClickable = true;
					}, 303);
				}
			}}
		>
			<div class="inputs">
				{#each tabNaviData as item}
					<input
						type="radio"
						id={item.__id}
						checked={item.index === selectedTab.index}
						onchange={() => {
							selectedTab = item;
							centerActiveTab(item.__id);
						}}
					/>
				{/each}
			</div>
			<ul
				class="labels"
				class:no-translate-x={translateX === undefined}
				style:--active-label-width="{activeLabelWidth + 2 * borderPadding.horizontal}px"
				style:--border-padding-horizontal="{borderPadding.horizontal}px"
				style:--border-padding-vertical="{borderPadding.vertical}px"
				style:--translate-x="{translateX}px"
				style:pointer-events={elementClickable ? 'auto' : 'none'}
			>
				{#each tabNaviData as { __id, index, label }}
					<li
						data-aid={__id}
						class:first={index === 0}
						class:last={index === tabNaviData.length - 1}
					>
						{#if index > 0 && __id !== selectedTab.__id && __id !== tabNaviData[selectedTab.index + 1]?.__id}
							<div class="separator"></div>
						{/if}
						<label
							for={__id}
							class:checked={index === selectedTab.index}
							bind:clientWidth={labelWidths[index]}
						>
							{label}
						</label>
					</li>
				{/each}
			</ul>
		</div>

	</div>

</div>


<style lang="scss">
	@use "./../scss/config" as config;

	$lineHeightTitle: 1.1;
	$lineHeightTabs: 1.26;
	$tabPadding: 0.06125rem 0.5rem;
	$tabMinWidth: 2.5rem;

	.tab-navigation {
		padding: 0.75rem 0;
	}

	.title {
		font-weight: 700;
		line-height: $lineHeightTitle;
		padding-bottom: 0.4375rem;
	}

	.tabs-bar {
		position: relative;
		overflow: hidden;
	}

	.tabs-switch {
		position: relative;
		display: flex;
		align-items: flex-start;
		overscroll-behavior: none;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		padding: 4px 0;

		scrollbar-width: none;
		-ms-overflow-style: none;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.inputs {
		display: none;
	}

	ul.labels {
		position: relative;
		display: flex;
		gap: calc(var(--border-padding-horizontal) * 2);
		margin: 0 0 0 var(--border-padding-horizontal);
		padding: 1px 0 0;
		list-style: none;

		&::before {
			position: absolute;
			top: calc(-1 * var(--border-padding-vertical) + 1px);
			right: calc(-1 * var(--border-padding-horizontal));
			bottom: calc(-1 * var(--border-padding-vertical));
			left: calc(-1 * var(--border-padding-horizontal));
			display: block;
			width: var(--active-label-width, 20px);
			border: 1px solid var(--duv-ui-graphic-dark);
			border-radius: 3px;
			transform: translateX(var(--translate-x, 0));
			transition: transform 0.3s, width 0.3s;
			box-sizing: border-box;
			pointer-events: none;
			content: '';
		}

		&.no-translate-x::before {
			display: none;
		}
	}

	li {
		display: flex;
		position: relative;

		&.last {
			margin-right: var(--border-padding-horizontal);
		}
	}

	label {

		text-align: center;
		text-underline-position: from-font;
		text-decoration-skip-ink: none;
		margin: 0;
		padding: $tabPadding;
		min-width: $tabMinWidth;
		color: var(--duv-ui-text-disabled);
		@include config.fontFamily(config.$spSans);
		font-size: config.$font-size-m;
		line-height: $lineHeightTabs;
		letter-spacing: 0.02em;
		transition: opacity 0.3s;
		box-sizing: border-box;
		user-select: none;
		cursor: pointer;
		text-wrap: nowrap;

		&:not(.checked) {
			cursor: pointer;
		}

		&.checked {
			color: var(--duv-ui-text-default);
		}

		&:hover {
			color: var(--duv-ui-text-default);
		}
	}

	.separator {
		position: absolute;
		left: calc(0% - var(--border-padding-horizontal) - 0.5px);
		top: 3px;
		width: 1px;
		height: 16px;
		background-color: var(--duv-ui-graphic-dark);
	}

	.fade {

		--duv-ui-tabnavi-fade-start: rgba(255, 255, 255, 0);
		--duv-ui-tabnavi-fade-end: rgba(255, 255, 255, 1);
		@media (prefers-color-scheme: dark) {
			--duv-ui-tabnavi-fade-start: rgba(31, 30, 28, 0);
			--duv-ui-tabnavi-fade-end: rgba(31, 30, 28, 1);
		}

		& {
			position: absolute;
			z-index: 19;
			top: 0;
			width: 20px;
			height: 29px;
			pointer-events: none;
		}

		&.right {
			left: unset;
			right: 0;
			background: linear-gradient(to right, var(--duv-ui-tabnavi-fade-start), var(--duv-ui-tabnavi-fade-end));
		}

		&.left {
			left: 0;
			right: unset;
			background: linear-gradient(to left, var(--duv-ui-tabnavi-fade-start), var(--duv-ui-tabnavi-fade-end));
		}

	}

</style>

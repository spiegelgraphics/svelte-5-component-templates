<script>
  /**
     * @component
     * ViewHeight component to manage and calculate the heights of the app within the view.
     *
     * @prop {boolean} isOpener - Indicates if the component is an opener. Default is false.
     * @prop {number} tolerance - The tolerance value for height calculations. Default is 180.
     * @prop {number} visualHeight - The visual height of the component. Default is bindable.
     * @prop {number} safeHeight - The safe height of the component. Default is bindable(0).
     */

	import { onMount } from 'svelte';

	import { environment as env } from '$stores/environment.svelte';
	import { params } from '$utils/params';

	let {
		isOpener = false,
		tolerance = 120,
		visualHeight = $bindable(),
		safeHeight = $bindable(0),
	} = $props();

	const isApp = document.documentElement.classList.contains('is-app');

	let tidResize;
	let container;
	let containerHeight = 0;

	const handleResize = () => {
		if (!container) return;

		({ height: containerHeight } = container.getBoundingClientRect());
		const isChangeByTolerance =
			Math.abs(containerHeight - visualHeight) > tolerance;

		if (
			!visualHeight ||
			containerHeight > visualHeight ||
			isChangeByTolerance || 
			(isApp && ( containerHeight - visualHeight  === 44 ))	// der iOS-App Bug, weil viewport sich ändert
		) {
			visualHeight = containerHeight;
		}		

		if (!safeHeight || isChangeByTolerance) {
			safeHeight =
				document.documentElement.clientHeight - env.polygonTopHeight - env.polygonBottomHeight;
		}
	};

	const throttleResize = () => {
		clearTimeout(tidResize);
		tidResize = setTimeout(handleResize, 125);
	};

	onMount(() => {
		throttleResize();
		return () => clearTimeout(tidResize);
	});

	window.addEventListener('resize', throttleResize);


	// containerHeight ist Höhe ohne irgendeinen Abzug, also die tatsächliche Höhe laut 100vh
	// visualHeight ist die Höhe des containers containerHeight, die nur geändert wird, wenn die Änderung größer als die Toleranz ist
	// 		damit nicht bei jeder kleinen Änderung die Höhe neu berechnet wird	
	
	// --polygon-headerbar-height: 80px oder 48px -> ist die Höhe der HeaderBar mit dem Burger und SPIEGEL-Logo
</script>


<div
	class="old-container"
	bind:this={container}
	></div>


<div class="duv-polygon-view-height"	
	bind:clientHeight={env.polygonContainerHeight}
	style="height: calc( 100vh - 0px  	
	- var(--polygon-navigation-height, 0px) 
	- var(--polygon-breakingnews-height, 0px)
	- var(--polygon-app-bottombar-height, 0px)
	- var(--polygon-app-collapsible-header-height, 0px) );"
	></div>


<div class="duv-polygon-view-height"
	bind:clientHeight={env.polygonAppCollapsibleHeaderHeight} 
	style="height: calc(var(--polygon-app-collapsible-header-height, 0px));"></div>

<div class="duv-polygon-view-height"
	bind:clientHeight={env.polygonAppBottombarHeight} 
	style="height: calc(var(--polygon-app-bottombar-height, 0px));"></div>

<div class="duv-polygon-view-height"
	bind:clientHeight={env.polygonAudioplayerHeight} 
	style="height: calc(var(--polygon-audioplayer-height, 0px));"></div>

<div class="duv-polygon-view-height"
	bind:clientHeight={env.polygonFeaturebarHeight} 
	style="height: calc(var(--polygon-featurebar-height, 0px));"></div>

<div class="duv-polygon-view-height"
	bind:clientHeight={env.polygonHeaderbarHeight} 
	style="height: calc(var(--polygon-headerbar-height, 0px));"></div>

<div class="duv-polygon-view-height"
	bind:clientHeight={env.polygonMaxHeaderbarHeight} 
	style="height: calc(var(--polygon-max-headerbar-height, 0px));"></div>

<div class="duv-polygon-view-height"
	bind:clientHeight={env.polygonNavigationHeight} 
	style="height: calc(var(--polygon-navigation-height, 0px));"></div>

<div class="duv-polygon-view-height"
	bind:clientHeight={env.polygonBreakingnewsHeight} 
	style="height: calc(var(--polygon-breakingnews-height, 0px));"></div>

<div class="duv-polygon-view-height"
	bind:clientHeight={env.polygonBlockTitleHeight} 
	style="height: calc(var(--polygon-block-title-height, 0px));"></div>

<div class="duv-polygon-view-height"
	bind:clientHeight={env.polygonAdStickyOffset} 
	style="height: calc(var(--polygon-ad-sticky-offset, 0px));"></div>

<div class="duv-polygon-view-height"
	bind:clientHeight={env.polygonZoneheaderHeight} 
	style="height: calc(var(--polygon-zoneheader-height, 0px));"></div>

<div class="duv-polygon-view-height"
	bind:clientHeight={env.polygonSmallestViewportHeight} 
	style="height: calc(var(--polygon-smallest-viewport-height, 100vh));"></div>






{#if params.debug}
	<div class="debug">
		<div class="debug-row"><span class="debug-label">--polygon-app-collapsible-header-height:</span><span class="debug-value">{env.polygonAppCollapsibleHeaderHeight}px</span></div>
		<div class="debug-row"><span class="debug-label">--polygon-app-bottombar-height:</span><span class="debug-value">{env.polygonAppBottombarHeight}px</span></div>
		<div class="debug-row"><span class="debug-label">--polygon-audioplayer-height:</span><span class="debug-value">{env.polygonAudioplayerHeight}px</span></div>
		<div class="debug-row"><span class="debug-label">--polygon-featurebar-height:</span><span class="debug-value">{env.polygonFeaturebarHeight}px</span></div>
		<div class="debug-row"><span class="debug-label">--polygon-headerbar-height:</span><span class="debug-value">{env.polygonHeaderbarHeight}px</span></div>
		<div class="debug-row"><span class="debug-label">--polygon-max-headerbar-height:</span><span class="debug-value">{env.polygonMaxHeaderbarHeight}px</span></div>
		<div class="debug-row"><span class="debug-label">--polygon-navigation-height:</span><span class="debug-value">{env.polygonNavigationHeight}px</span></div>
		<div class="debug-row"><span class="debug-label">--polygon-breakingnews-height:</span><span class="debug-value">{env.polygonBreakingnewsHeight}px</span></div>
		<div class="debug-row"><span class="debug-label">--polygon-block-title-height:</span><span class="debug-value">{env.polygonBlockTitleHeight}px</span></div>
		<div class="debug-row"><span class="debug-label">--polygon-ad-sticky-offset:</span><span class="debug-value">{env.polygonAdStickyOffset}px</span></div>
		<div class="debug-row"><span class="debug-label">--polygon-zoneheader-height:</span><span class="debug-value">{env.polygonZoneheaderHeight}px</span></div>
		<div class="debug-row"><span class="debug-label">--polygon-smallest-viewport-height:</span><span class="debug-value">{env.polygonSmallestViewportHeight}px</span></div>
	</div>
{/if}

<style lang="scss">
	.debug {
		position: fixed;
		z-index: 999999;
		top: 200px;
		left: 8px;
		opacity: 0.85;
		pointer-events: none;
		padding: .5rem;
		background: rgba(0, 0, 0, 0.85);
		color: white;
		font-size: 14px;
	}
	.debug-row {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}
	.debug-label {
		font-size: 14px;
	}
	.debug-value {
		flex: 0 0 auto;
		text-align: right;
		min-width: 60px;
	}
	.duv-polygon-view-height {
		position: absolute;
		opacity: 0;
	}
	.old-container {
		width: 100%;
		position: absolute;
		z-index: 999999;
		top: 0;
		left: 0;
		opacity: 0;
		pointer-events: none;
		height: 100vh;
	}
</style>

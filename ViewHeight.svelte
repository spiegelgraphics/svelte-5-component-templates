<script>
  /**
     * @component
     * ViewHeight component to manage and calculate the heights of the app within the view.
     *
     * @prop {boolean} isOpener - Indicates if the component is an opener. Default is false.
     * @prop {number} tolerance - The tolerance value for height calculations. Default is 180.
     * @prop {number} visualHeight - The visual height of the component. Default is bindable.
     * @prop {number} safeHeight - The safe height of the component. Default is bindable(0).
     * @prop {number} headerHeight - The height of the header. Default is bindable.
     * @prop {number} footerHeight - The height of the footer. Default is bindable.
     * @prop {number} contentHeight - The height of the content. Default is bindable.
     */

	import { onMount } from 'svelte';

	let {
		isOpener = false,
		tolerance = 180,
		visualHeight = $bindable(),
		safeHeight = $bindable(0),
		headerHeight = $bindable(),
		footerHeight = $bindable(),
		contentHeight = $bindable(),
	} = $props();

	const isApp = document.documentElement.classList.contains('is-app');

	let tidResize;
	let container;
	let containerHeight = 0;

	const isSmall = () => window.innerWidth < 520;

	const getHeaderHeight = () => (isApp || isOpener ? 0 : isSmall() ? 100 : 108);

	const getFooterHeight = () => (isApp ? 59 : 0); // 53 was not enough..?

	const handleResize = () => {
		if (!container) return;

		({ height: containerHeight } = container.getBoundingClientRect());
		const isChangeByTolerance =
			Math.abs(containerHeight - visualHeight) > tolerance;

		if (
			!visualHeight ||
			containerHeight > visualHeight ||
			isChangeByTolerance
		) {
			visualHeight = containerHeight;
		}
		headerHeight = getHeaderHeight();
		footerHeight = getFooterHeight();
		contentHeight = visualHeight - headerHeight - footerHeight;
		if (!safeHeight || isChangeByTolerance) {
			safeHeight =
				document.documentElement.clientHeight - headerHeight - footerHeight;
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
</script>

<div bind:this={container}></div>

<style lang="scss">
	div {
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
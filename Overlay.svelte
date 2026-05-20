<script>
  /**
     * @component
     * Overlay
     * 
     * A full-screen fixed overlay that portals its content to document.body. Prevents background scrolling
     * while active and forwards specified CSS custom properties to the portaled element.
     * 
     * @prop {Array} cssVars - A list of CSS custom property names to forward from the component's context to the portaled overlay element.
     * @prop {Snippet} children - The content to render inside the overlay.
     */

	import { onMount } from 'svelte';

	const { cssVars, children } = $props();

	let overlayEl;

	onMount(() => {
		for (const name of cssVars) {
			const value = getComputedStyle(overlayEl).getPropertyValue(name);
			if (value) overlayEl.style.setProperty(name, value);
		}
		document.body.appendChild(overlayEl);
		return () => overlayEl.remove();
	});

	$effect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<div
	class="duv-overlay"
	bind:this={overlayEl}
>
	{@render children?.()}
</div>

<style lang="scss">
	.duv-overlay {
		position: fixed;
		inset: 0;
		z-index: 10000;
		overflow: hidden;
	}
</style>

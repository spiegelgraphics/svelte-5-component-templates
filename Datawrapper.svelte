<script>
	import { onMount } from 'svelte';

	const { id, viz = $bindable(), css = undefined, onMessage = undefined, ...rest } = $props();

	let observer, container;

	function setViz() {
		[viz = undefined] = container.getElementsByTagName('datawrapper-visualization') || [];
		if (viz) {
			observer.disconnect();
			if (css) {
				const style = document.createElement('style');
				style.innerHTML = css;
				viz.shadowRoot.appendChild(style);
			}
		}
	}

	onMount(() => {
		const Observer =
			MutationObserver ||
			window.MutationObserver ||
			window.WebKitMutationObserver ||
			window.MozMutationObserver;
		observer = new Observer(setViz);
		observer.observe(container, {
			subtree: true,
			childList: true
		});

		return () => {
			observer.disconnect();
		};
	});

	$effect(() => {
    if (!onMessage) return;
		const listener = (message) => {
			onMessage(message?.data);
		};
		window.addEventListener('message', listener);
		return () => {
			window.removeEventListener('message', listener);
		};
	});
</script>

<div
	bind:this={container}
	class="duv-datawrapper-embed"
>
	<script
		type="text/javascript"
		defer
		src="https://datawrapper.dwcdn.net/{id}/embed.js"
		charset="utf-8"
		{...rest}
	></script><noscript
		><img
			src="https://datawrapper.dwcdn.net/{id}/full.png"
			alt=""
		/></noscript
	>
</div>
<script module>
  /**
     * @component
     * Scroller component to handle scrolling behavior with foreground and background elements.
     *
     * @prop {number} threshold - The threshold for triggering scroll events. Default is 0.5.
     * @prop {string} query - The query selector for sections. Default is 'section'.
     * @prop {number} contentHeight - The height of the content. Default is 0.
     * @prop {number} absoluteHeight - The absolute height of the scroller. Default is 0.
     * @prop {number} top_px - The top offset in pixels. Default is 0.
     * @prop {string} pointerEvents - The pointer events setting. Default is 'background'.
     * @prop {number} index - The current index of the scroller. Default is bindable.
     * @prop {number} count - The count of items in the scroller. Default is bindable(0).
     * @prop {number} offset - The offset value for the scroller. Default is bindable(0).
     * @prop {number} progress - The progress value of the scroller. Default is bindable(0).
     * @prop {boolean} fixed - Whether the scroller is fixed. Default is bindable.
     * @prop {HTMLElement} background - The background element of the scroller.
     * @prop {HTMLElement} foreground - The foreground element of the scroller.
     */
    
	const handlers = [];
	let manager;

	if (typeof window !== 'undefined') {
		const run_all = () => handlers.forEach((fn) => fn());

		window.addEventListener('scroll', run_all);
		window.addEventListener('resize', run_all);
	}

	if (typeof IntersectionObserver !== 'undefined') {
		const map = new Map();

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const update = map.get(entry.target);
					const index = handlers.indexOf(update);

					if (entry.isIntersecting) {
						if (index === -1) handlers.push(update);
					} else {
						update();

						if (index !== -1) handlers.splice(index, 1);
					}
				});
			},
			{
				rootMargin: '333px 0px 0px 0px',
			},
		);

		manager = {
			add: ({ outer, update }) => {
				const { top, bottom } = outer.getBoundingClientRect();

				if (top < window.innerHeight && bottom > 0) handlers.push(update);
				map.set(outer, update);
				observer.observe(outer);
			},

			remove: ({ outer, update }) => {
				const index = handlers.indexOf(update);
				if (index !== -1) handlers.splice(index, 1);

				map.delete(outer);
				observer.unobserve(outer);
			},
		};
	} else {
		manager = {
			add: ({ update }) => {
				handlers.push(update);
			},

			remove: ({ update }) => {
				const index = handlers.indexOf(update);
				if (index !== -1) handlers.splice(index, 1);
			},
		};
	}
</script>

<script>
	import { onMount, untrack } from 'svelte';

	let {
		threshold = 0.5,
		query = 'section',
		contentHeight = 0,
		absoluteHeight = 0,
		top_px = 0,
		pointerEvents = 'background',
		index = $bindable(),
		count = $bindable(0),
		offset = $bindable(0),
		progress = $bindable(0),
		fixed = $bindable(),
    background,
    foreground
	} = $props();

	let outer;
	let left;
	let sections;
  
	let foregroundElement;
	let offset_top = $state(0);
	let width = $state(1);

	const threshold_px = $derived(Math.round(threshold * absoluteHeight));

	$effect(() => {
		top_px, contentHeight, threshold;
		untrack(update);
	});

	onMount(() => {
		sections = foregroundElement.querySelectorAll(query);
		count = sections.length;

		update();

		const scroller = { outer, update };

		manager.add(scroller);
		return () => manager.remove(scroller);
	});

	function update() {
    if (!foregroundElement || !sections) return;
    
		const bcr = outer.getBoundingClientRect();
		left = bcr.left;
		width = bcr.right - left;
    
		const fg = foregroundElement.getBoundingClientRect();
    
		const foreground_height = fg.bottom - fg.top;
    
		progress = (top_px - fg.top) / (foreground_height - contentHeight);
    
		if (progress <= 0) {
      offset_top = 0;
			fixed = false;
			progress = 0;
		} else if (progress >= 1) {
      offset_top = foreground_height - contentHeight;
			fixed = false;
			progress = 1;
		} else {
      offset_top = top_px;
			fixed = true;
		}
    
		for (let i = 0; i < sections.length; i++) {
			const section = sections[i];
			const { top } = section.getBoundingClientRect();

			const next = sections[i + 1];
			const bottom = next ? next.getBoundingClientRect().top : fg.bottom;

			offset = Math.max(0, Math.min(1, (threshold_px - top) / (bottom - top)));
			if (bottom >= threshold_px) {
				index = i;
				break;
			}
		}
	}
</script>

<svelte-scroller-outer bind:this={outer}>
	<svelte-scroller-background-container
		class="background-container"
		class:pointer-events={pointerEvents === 'background'}
		style:width={width + 'px'}
		style:position={fixed ? 'fixed' : 'absolute'}
		style:top={0}
		style:transform="translate(0, {offset_top}px)"
	>
		<svelte-scroller-background>
			{@render background()}
		</svelte-scroller-background>
	</svelte-scroller-background-container>

	<svelte-scroller-foreground
		bind:this={foregroundElement}
		class:pointer-events={pointerEvents === 'foreground'}
	>
    {@render foreground()}
	</svelte-scroller-foreground>
</svelte-scroller-outer>

<style>
	.pointer-events {
		pointer-events: all;
	}

	svelte-scroller-outer {
		display: block;
		position: relative;
	}

	svelte-scroller-background {
		display: block;
		position: relative;
		width: 100%;
	}

	svelte-scroller-foreground {
		display: block;
		position: relative;
		z-index: 2;
		pointer-events: none;
	}

	svelte-scroller-foreground::after {
		content: ' ';
		display: block;
		clear: both;
	}

	svelte-scroller-background-container {
		display: block;
		position: absolute;
		width: 100%;
		max-width: 100%;
		pointer-events: none;
		will-change: transform;
	}
</style>
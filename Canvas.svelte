<script>
  /**
     * @component
     * Canvas component to render a drawable canvas with optional zoom and transform capabilities.
     *
     * @prop {number} width - The width of the canvas.
     * @prop {number} height - The height of the canvas.
     * @prop {Object} transform - The transform object for zooming and panning. Default is zoomIdentity.
     * @prop {boolean} alpha - Indicates if the canvas should support transparency. Default is false.
     * @prop {boolean} hide - Indicates if the canvas should be hidden. Default is false.
     * @prop {Function} onmousemove - Callback function for mouse move events. Default is an empty function.
     * @prop {Function} onclick - Callback function for click events. Default is an empty function.
     * @prop {string} contextName - The context name for the canvas. Default is 'spiegel-canvas'.
     * @prop {Function} children - Function to render child components or snippets.
     * 
     * @css [--position=relative] - The position of the canvas.
     * @css [--pointer-events=all] - The pointer events of the canvas.
     */

	import { setContext } from 'svelte';
  import { zoomIdentity } from 'd3';

	let {
		width,
		height,
		transform = zoomIdentity,
    alpha = false,
		hide = false,
    onmousemove: onmousemoveCallback = () => {},
    onclick: onclickCallback = () => {},
		contextName = 'spiegel-canvas',
    children
	} = $props();

	const drawFunctions = [];
	const devicePixelRatio = Math.max(2, window ? (window.devicePixelRatio || 1) : 1);

	let canvas;
	let ctx;
	let frameId;
	let pendingInvalidation = false;

  let isHovered = $state(false);

	function scaleCanvas(canvas, ctx, width, height) {
		canvas.width = width * devicePixelRatio;
		canvas.height = height * devicePixelRatio;
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';

		ctx.scale(devicePixelRatio, devicePixelRatio);
	}

  function invalidate() {
		if (pendingInvalidation) return;
		pendingInvalidation = true;
		frameId = requestAnimationFrame(update);
	}

	function update() {
		if (!ctx) return;

		ctx.clearRect(0, 0, width, height);

		drawFunctions.forEach((fn) => {
			ctx.save();
			ctx.translate(transform.x, transform.y);
			ctx.scale(transform.k, transform.k);
			fn(ctx);
			ctx.restore();
		});

		pendingInvalidation = false;
	}

  function getColorId({ offsetX: x, offsetY: y }) {
    if (!ctx || !x || !y) return;
    const { data } = ctx.getImageData(
			x * devicePixelRatio,
			y * devicePixelRatio,
			1,
			1,
		);
		const [r, g, b] = data;
		if (r + g + b === 0) return null;
		return `rgb(${r},${g},${b})`;
  }

	function onmousemove(event) {
    event.preventDefault();
    const data = getColorId(event);
    isHovered = data !== null;
		onmousemoveCallback({
      event,
      data
    });
	}
  
  function onclick(event) {
    event.preventDefault();
    onclickCallback({
      event,
      data: getColorId(event)
    });
  }

  setContext(contextName, {
		register(fn) {
			drawFunctions.push(fn);
		},
		deregister(fn) {
			drawFunctions.splice(drawFunctions.indexOf(fn), 1);
		},
		invalidate,
	});

	$effect(() => {
		ctx = canvas.getContext('2d', { willReadFrequently: true, alpha });

		return () => {
			if (frameId) {
				cancelAnimationFrame(frameId);
			}
		};
	});

  $effect(() => {
    if (canvas && ctx) scaleCanvas(canvas, ctx, width, height);
  });
</script>

<canvas
	class:hide={hide}
  class:is-hovered={isHovered}
	bind:this={canvas}
	{onmousemove}
  {onclick}
/>
{@render children()}

<style>
	canvas {
		position: var(--position, relative);
		top: 0;
		left: 0;
    pointer-events: var(--pointer-events, all);
	}

	canvas.hide {
		opacity: 0;
	}

  canvas.is-hovered {
    cursor: pointer;
  }
</style>

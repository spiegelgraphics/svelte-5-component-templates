<script>
  /**
     * @component
     * CanvasFeature component to draw a feature on a Canvas.svelte component with various styling options.
     * Use this component as children for Canvas.svelte
     *
     * @prop {string} path - The path data for the feature.
     * @prop {string} fill - The fill color for the feature.
     * @prop {string} stroke - The stroke color for the feature.
     * @prop {number} strokeWidth - The width of the stroke. Default is 1.
     * @prop {string} backgroundStroke - The background stroke color for the feature. Default is undefined.
     * @prop {number} backgroundStrokeWidth - The width of the background stroke. Default is 3.
     * @prop {string} foregroundStroke - The foreground stroke color for the feature. Default is undefined.
     * @prop {number} foregroundStrokeWidth - The width of the foreground stroke. Default is 1.
     * @prop {number} globalAlpha - The global alpha value for the feature. Default is 1.0.
     * @prop {boolean} showStroke - Indicates if the stroke should be shown. Default is false.
     * @prop {boolean} showFill - Indicates if the fill should be shown. Default is false.
     * @prop {CanvasPattern} pattern - The pattern to be used for filling the feature. Default is undefined.
     * @prop {string} contextName - The context name for the canvas. Default is 'spiegel-canvas'.
     */

	import { getContext, onMount } from 'svelte';

	let {
		path,
		fill,
		stroke,
		strokeWidth = 1,
		backgroundStroke = undefined,
		backgroundStrokeWidth = 3,
		foregroundStroke = undefined,
		foregroundStrokeWidth = 1,
		globalAlpha = 1.0,
		showStroke = false,
		showFill = false,
		pattern = undefined,
		contextName = 'spiegel-canvas',
	} = $props();
	
	const { register, deregister, invalidate } = getContext(contextName);

	function draw(ctx) {
		const p = new Path2D(path);
		ctx.globalAlpha = globalAlpha;
		if (showFill && fill) {
			ctx.fillStyle = fill;
			ctx.fill(p);
			if (pattern) {
				ctx.fillStyle = ctx.createPattern(pattern, 'repeat');
				ctx.fill(p);
			}
		}
		if (showStroke && stroke) {
			if (backgroundStroke) {
				ctx.strokeStyle = backgroundStroke;
				ctx.lineWidth = backgroundStrokeWidth;
				ctx.stroke(p);
			}
			ctx.strokeStyle = stroke;
			ctx.lineWidth = strokeWidth;
			ctx.stroke(p);
		}
		if (foregroundStroke) {
			ctx.strokeStyle = foregroundStroke;
			ctx.lineWidth = foregroundStrokeWidth;
			ctx.stroke(p);
		}
	}

	onMount(() => {
		register(draw);
		invalidate();
		return () => deregister(draw);
	});

	$effect(() => {
		path, stroke, strokeWidth, fill, showStroke, showFill;
		invalidate();
	});
</script>

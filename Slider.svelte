
<script>
	  import { getValue } from "$lib/models/value";

     /**
     * @component
     * Slider
     * 
     * A component that renders a slider for selecting a value within a specified range.
     * 
     * @prop {Number} min - The minimum value of the slider.
     * @prop {Number} max - The maximum value of the slider.
     * @prop {Number} step - The step size for the slider.
     * @prop {Number} value - The current value of the slider. This is a bindable property.
     * @prop {String} unit - The unit to display next to the value.
     * @prop {String} headline - An optional headline to display above the slider. Can contain HTML.
     * @prop {Boolean} isAnimated - Whether the slider should animate when first rendered.
     * @prop {Boolean} bothDirections - Whether the slider should show hints in both directions.
     * @prop {Number} decimals - The number of decimal places to display for the value.
     * @prop {Array} ticks - An array of tick marks to display on the slider. Each tick should have a `value` and a `label`.
     * 
     * @event change - Fired when the slider value changes. The event detail contains the new value.
     */

    let { headline, value = $bindable({}), min, max, step, unit, isAnimated = true, bothDirections = true, decimals = 0, ticks = null } = $props();

    let hasInteracted = $state(false);
    
    const thumbWidth = 36;

    let fraction = $derived((value - min) / (max - min));
    let barWidth = $derived(fraction * 100);
    
    let thumbPos = $derived(`calc(${fraction} * (100% - ${thumbWidth}px) + ${thumbWidth / 2}px)`);

    let trackEl = $state(null);
    let dragging = $state(false);

    function clamp(v) {
        return Math.max(min, Math.min(max, v));
    }
    
    function valueFromClientX(clientX) {
        if (!trackEl) return value;
        const rect = trackEl.getBoundingClientRect();
        const usable = rect.width - thumbWidth;
        const x = clientX - rect.left - thumbWidth / 2;
        const f = usable > 0 ? Math.max(0, Math.min(1, x / usable)) : 0;
        const raw = min + f * (max - min);
        const snapped = clamp(min + Math.round((raw - min) / step) * step);
        return parseFloat(snapped.toFixed(6));
    }

    function clientXFromEvent(e) {
        if (e.type.startsWith("touch")) {
            const t = e.touches?.[0] ?? e.changedTouches?.[0];
            return t ? t.clientX : null;
        }
        return e.clientX;
    }

    function onDragStart(e) {
        hasInteracted = true;
        dragging = true;
        const cx = clientXFromEvent(e);
        if (cx !== null) value = valueFromClientX(cx);
    }
    
    function onDragMove(e) {
        if (!dragging) return;
        
        if (e.cancelable) e.preventDefault();
        const cx = clientXFromEvent(e);
        if (cx !== null) value = valueFromClientX(cx);
    }

    function onDragEnd() {
        dragging = false;
    }

    function onKeyDown(e) {
        let delta = 0;
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -step;
        else if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = step;
        else return;
        e.preventDefault();
        hasInteracted = true;
        value = parseFloat(clamp(value + delta).toFixed(6));
    }
    
    $effect(() => {
        window.addEventListener("touchmove", onDragMove, { passive: false });
        return () => window.removeEventListener("touchmove", onDragMove);
    });

</script>

<svelte:window
    onmousemove={onDragMove}
    onmouseup={onDragEnd}
    ontouchend={onDragEnd}
    ontouchcancel={onDragEnd}
/>

<div class="element-container">
    {#if headline}
        <div class="headline">{@html headline}</div>
    {/if}

    <div
        class="outer-container"
        style:--barWidth={thumbPos}
        bind:this={trackEl}
        role="slider"
        tabindex="0"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onmousedown={onDragStart}
        ontouchstart={onDragStart}
        onkeydown={onKeyDown}
    >
        <div class="inner-container"></div>
        <div class="progress-container">
            <div class="thumb-left"></div>
            <div class="bar" style="width: {thumbPos}"></div>
            <div class="thumb" style="left: {thumbPos}"></div>
            <div class="thumb-outer" style="left: {thumbPos}"></div>
            {#if !hasInteracted && isAnimated}
                <div class="thumb-hint {bothDirections ? 'both-directions' : ''}" style="left: {thumbPos}"></div>
            {/if}
            <div class="value"
                style:left={barWidth <= 50 ? "calc(var(--barWidth) + 25px)" : ""}
                style:right={barWidth > 50 ? "calc(100% - var(--barWidth) + 20px)" : ""}
                style:color={barWidth <= 50 ? "var(--int-font-color-link)" : "white"}>
                {getValue(value, decimals, '', false).str}&thinsp;{unit}
            </div>
        </div>
    </div>
    {#if ticks && ticks.length > 0}
        <div class="ticks">
            {#each ticks as tick}
                {@const pos = (tick.value - min) / (max - min) * 100}
                <div class="tick" style:left="{pos}%" onclick={() => { value = tick.value; hasInteracted = true; }} role="button" tabindex="0" onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { value = tick.value; hasInteracted = true; } }}>
                    <div class="tick-mark"></div>
                    <span class="tick-label">{tick.label}</span>
                </div>
            {/each}
        </div>
    {/if}
</div>

    
<style lang="scss">
    @use './../../scss/config';
    
    .element-container {
        display: flex;
        flex-direction: column;
        user-select: none;
        // overflow: hidden;
    }
    
    .outer-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 36px;
        width: 100%;
        position: relative;
        background-color: var(--int-button-background-color, var(--int-color-gray-fonds));
        border-radius: 18px;
        overflow: hidden;
        cursor: pointer;
        touch-action: none;
        outline: none;
    }
    
    .inner-container, 
    .progress-container {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        width: 100%;
        background-color: transparent;
    }
    
    .progress-container {
        display: flex;
        align-items: center;
        height: 16px;
    }
    
    .bar {
        height: 36px;
        background-color: var(--int-font-color-link, var(--int-font-color-shade-dark));
        position: absolute;
    }
    
    .thumb {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 14px;
        height: 14px;
        background-color: white;
        border-radius: 50%;
        z-index: 20;
    }

    .thumb-outer {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 36px;
        height: 36px;
        background-color: var(--int-font-color-link);
        border-radius: 50%;
        z-index: 10;
    }
    
    .thumb-left {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 36px;
        height: 36px;
        background-color: var(--int-font-color-link);
        border-radius: 50%;
        left: 0;
        z-index: 10;
    }
    
    .value {
        position: absolute;
        color: var(--int-font-color-link);
        font-size: config.$font-size-l;
        @include config.fontFamily(config.$spSansBold);
        z-index: 4;
        white-space: nowrap;
    }
    
    .headline {
        font-size: config.$font-size-m;
        color: var(--int-font-color-default);
        margin-bottom: 0.5rem;
        @include config.fontFamily(config.$spSansBold);
    }

    .thumb-hint {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 14px;
        height: 14px;
        background-color: white;
        border-radius: 50%;
        z-index: 25;
        animation: slideHint 3s ease-in-out infinite;
        opacity: 0;

        &.both-directions {
            animation: slideHintBoth 3s ease-in-out infinite;
        }
    }

    @keyframes slideHint {
        0%, 100% {
            left: var(--barWidth);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
        60% {
            left: calc(var(--barWidth) + 6%);
            opacity: 0;
        }
    }

    @keyframes pulseHint {
        0%, 100% {
            transform: translate(-50%, -50%) scale(1);
        }
        50% {
            transform: translate(-50%, -50%) scale(2);
        }
    }

    @keyframes slideHintBoth {
      0%,
      100% {
        left: var(--barWidth);
        opacity: 1;
      }
      30% {
        left: calc(var(--barWidth) - 12px);
        opacity: 0.5;
      }
      50% {
        left: var(--barWidth);
        opacity: 1;
      }
      70% {
        left: calc(var(--barWidth) + 16px);
        opacity: 0.75;
      }
    }

    .ticks {
        position: relative;
        width: calc(100% - 36px);
        margin-left: 18px;
        margin-top: 4px;
        height: 1.5rem;
    }

    .tick {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translateX(-50%);
        cursor: pointer;
    }

    .tick-mark {
        width: 1px;
        height: 4px;
        background-color: var(--int-font-color-default, #888);
        opacity: 0.4;
    }

    .tick-label {
        font-size: config.$font-size-s;
        color: var(--int-font-color-default);
        opacity: 0.6;
        white-space: nowrap;
        margin-top: 2px;
    }
    </style>
    
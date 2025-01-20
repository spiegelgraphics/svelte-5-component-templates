<script>
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
     * 
     * @event change - Fired when the slider value changes. The event detail contains the new value.
     */

    import { getValue } from '$utils/value.js';

    let { headline, value = $bindable({}), min, max, step, unit } = $props();
    let barWidth = $derived((value - min) / (max - min) * 100);

</script>

<div class="element-container">
    {#if headline}
        <div class="headline">{@html headline}</div>
    {/if}

    <div class="outer-container" style:--barWidth={barWidth + "%"}>
        <div class="inner-container"></div>
        <div class="progress-container">
            <div class="thumb-left"></div>
            <div class="bar" style="width: {barWidth}%"></div>
            <div class="thumb" style="left: {barWidth}%"></div>
            <div class="thumb-outer" style="left: {barWidth}%"></div>
            <div class="value"
                style:left={barWidth <= 50 ? "calc(var(--barWidth) + 25px)" : ""}
                style:right={barWidth > 50 ? "calc(100% - var(--barWidth) + 20px)" : ""}
                style:color={barWidth <= 50 ? "var(--int-font-color-link)" : "white"}>
                {getValue(value, 0, '', false).str}&thinsp;{unit}
            </div>
        </div>
        <input type="range" bind:value min={min} max={max} step={step} />
    </div>
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
        background-color: var(--int-button-background-color);
        border-radius: 18px;
        overflow: hidden;
    }
    
    .inner-container, 
    .progress-container {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: calc(100% - 36px);
        background-color: transparent;
    }
    
    .progress-container {
        display: flex;
        align-items: center;
        height: 16px;
    }
    
    .bar {
        height: 36px;
        background-color: var(--int-font-color-link);
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
    
    input[type="range"] {
        position: absolute;
        width: calc(100% - 36px);
        height: 36px;
        appearance: none;
        background: transparent;
        opacity: 0;
        z-index: 30;
    }
    
    .headline {
        font-size: config.$font-size-m;
        color: var(--int-font-color-default);
        margin-bottom: 0.5rem;
        @include config.fontFamily(config.$spSansBold);
    }
    </style>
    
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

    let {
        value,
        min,
        max,
        step,
        unit
    } = $props();

    let barWidth = $derived(value / max * 100);
    let click = $state(false);

    const ScalePoint = (e) => {
        click = true;
    }

    const ScalePointDown = (e) => {
        click = false;
    }

</script>

<div class="outer-container" style:--barWidth={barWidth + "%"}>
    <div class="thumb-container">
        <div class="inner">
            <div class="thumb"
                style:transform={click ? "scale(1.5)" : "scale(1)"}
            ></div>
        </div>

        <div class="value"
            style:left={ barWidth <= 50 ? "calc(var(--barWidth) + 40px)" : ""}
            style:right={ barWidth > 50 ? "calc(100% - var(--barWidth) + 40px)" : ""}
            style:color={ barWidth < 50 ? "var(--int-font-color-link)" : "white"}
        >
            {value}&thinsp;{unit}
        </div>
    </div>

    <div 
        class="bar" 
        style:width={barWidth}% 
        style:border-radius={barWidth > 50 ? "0 18px 18px 0" : "0" }
        >
    </div>

    <div class="input-container">
        <input 
            type="range"
            id="slider"
            min={min}
            max={max}
            step={step}
            bind:value
            onmousedown={ScalePoint}
            onmouseup={ScalePointDown}
            ontouchstart={ScalePoint}
            ontouchend={ScalePointDown}
        />
    </div>
</div>

<style lang="scss">
	@use './../../scss/config';

    input {
        width: 100%;
    }

    .input-container {
        display: flex;
        height: 36px;
        position: relative;
        z-index: 2; 
    }

    .outer-container {
        border-radius: 18px;
        position: relative;
        overflow: hidden; 
    }

    .thumb-container{
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        width: 100%;
        background-color: var(--int-button-background-color);
        height: 36px;
        pointer-events: none;

        .inner{
            width: calc(100% - 36px);


            .thumb{
                width: 14px;
                height: 14px;
                background-color: white;
                border-radius: 50%;
                position: relative;
                left: calc(var(--barWidth) - 7px);
                z-index: 3;       
            }
        }
    }

    .bar {
        position: absolute; 
        background-color: var(--int-font-color-link);
        height: 36px;
        top: 0;
        left: 0;
        z-index: 1; 
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
        appearance: none;
        background: transparent;
    }

    input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        width: 36px;
        height: 36px;
        background-color: var(--int-font-color-link);
        border-radius: 0 50% 50% 0;
        cursor: pointer;
        position: relative;
    }

    input[type="range"]::-moz-range-thumb {
        width: 36px;
        height: 36px;
        background-color: var(--int-font-color-link);
        border-radius: 0 50% 50% 0;
        border: none;
        cursor: pointer;
        position: relative;
    }

</style>

<script>

    /**
     * @component
     * LoadingAnimation, a circular loader with a percentage indicator.
     *
     * @prop {boolean} isIframe - if iframe-app, default is false
     * @prop {number} percent - optional percent-value
     *
     */

    let {isIframe = false, percent} = $props();

    let pathLength = 126;
    let dashOffset = $state(pathLength);

    $effect(() => {
        if( !percent && percent !== 0 ){
            dashOffset = pathLength - 1 * pathLength;
        }else{
            dashOffset = pathLength - (percent/100) * pathLength;
        }
    });

</script>


<div class="loadingAni absolute flex h-full items-center justify-center w-full"
     class:iframe={isIframe}>
    <svg class="circular-loader" viewBox="25 25 50 50">
        <circle class="loader-path" cx="50" cy="50" r="20" fill="none"
                style="stroke-dashoffset:{dashOffset};">
        </circle>
    </svg>
    <span class="text-primary-base dark:text-dm-primary-base">
        <svg class="fill-current" width="40" height="66" viewBox="0 0 24 30"
             xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
            <path class="fill-current"
            d="M20 29.4V13H6.3V5.4h7.2V10H20V3.4C20 1.5 18.4 0 16.5 0h-13C1.6 0 0 1.6 0 3.5v15h13.5v9H6.3v-6.1H0v8C0 31.3 1.6 33 3.5 33h13c1.9-.2 3.5-1.7 3.5-3.6z">
            </path>
        </svg>
    </span>
</div>

<style>

    .loader-path {
        stroke-dasharray: 126;
        stroke-dashoffset: 126;
        transition: stroke-dashoffset 0.42s linear;
        stroke: #e64415;
        stroke-width: 0.5;
        stroke-linecap: round;
    }

    .circular-loader {
        transform: rotate(-90deg);
        position: absolute;
        z-index: 999999999;
        width: 150px;
        height: 150px;
        margin-left: -8px;
    }

    .loadingAni {
        pointer-events: none;
        justify-content: center !important;
        align-items: center !important;
    }

    .fill-current {
        fill: currentColor;
    }

    .w-full {
        width: 100%;
    }

    .absolute {
        position: absolute;
    }

    .h-full {
        height: 100%;
        min-height: 250px;
        max-height: 40vh;
        z-index: 99999;
    }

    .iframe {
        min-height: 86vh !important;
    }

    .justify-center {
        justify-content: center;
    }

    .items-center {
        align-items: center;
    }

    .flex {
        display: flex;
    }

    .absolute {
        position: absolute;
    }

    .dark\:text-dm-primary-base {
        color: #d03d12;
    }

    .text-primary-base {
        color: #e64415;
    }

    * {
        --tw-shadow: 0 0 transparent;
    }

    svg {
        display: inline;
        vertical-align: baseline;
    }

</style>

<script>
    /**
     * @component
     * Checks the Width and/or Height of children Element
     *
     * @prop {Number} width - Bindable Width of the Element
     * @prop {Number} height - Bindable Height of the Element
     * @prop {HTMLElement} children - Element to watch
     *
     */

    import {onMount} from 'svelte';

    let {width = $bindable(undefined), height = $bindable(undefined), children} = $props();

    let tid;
    let container = $state();

    function handleResize() {
        clearTimeout(tid);
        if (!container) return;
        ({width, height} = container.getBoundingClientRect());
    }

    function throttleResize() {
        clearTimeout(tid);
        tid = setTimeout(handleResize, 100);
    }

    onMount(() => {
        new ResizeObserver(throttleResize).observe(container);
        return () => clearTimeout(tid);
    });

</script>

<svelte:window onresize={throttleResize}/>

<div class="size-detector" bind:this={container} >
     {@render children?.()}
</div>

<style lang="scss">
  .size-detector {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>

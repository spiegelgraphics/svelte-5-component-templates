<script>

    import Grid from "$components/Grid.svelte";
    import Button from "$components/Button.svelte";
    import Datawrapper from "$components/Datawrapper.svelte";

    const columnMinWidth = 103;
    const fewItems = 6;
    const dataWrapperIds = ["cWEvG", "cWEvG", "cWEvG", "cWEvG", "cWEvG", "cWEvG", "cWEvG", "cWEvG", "cWEvG", "cWEvG", "cWEvG",
        "cWEvG", "cWEvG", "cWEvG", "cWEvG"];

    let isOpen = $state(false);
    let visibleItems = $state(fewItems);
    let gridWidth = $state();
    let gridContainer = $state();

    const buttonText = $derived(!isOpen ? "Show More" : "Show Less");


    $effect(() => {

        gridWidth;

        if (gridContainer) {
            const style = getComputedStyle(gridContainer.querySelector('.grid'));
            const nCols = style.getPropertyValue('grid-template-columns').split(' 0px').join('').split(' ').length;
            const itemsLastRow = visibleItems % nCols;

            // last Row not fully filled
            if (itemsLastRow !== 0 && itemsLastRow < (nCols - 1)) {

                // adjust visibleItems
                if (visibleItems < (dataWrapperIds.length - (nCols - itemsLastRow))) {
                    visibleItems = visibleItems + (nCols - itemsLastRow);
                } else {
                    visibleItems = fewItems;
                }

            } else {
                // try default value
                if (!isOpen && fewItems % nCols === 0) {
                    visibleItems = fewItems;
                }
            }
        }
    });


</script>

<div class="content">


    <div class="debug">fewItems: {fewItems}<br>visibleItems: {visibleItems}<br>length: {dataWrapperIds.length}</div>


    <div class="container" bind:clientWidth={gridWidth} bind:this={gridContainer}>
        <Grid --column-min-width="{columnMinWidth}px">
            {#each dataWrapperIds as id, i}
                {#if i < visibleItems }
<!--                     <Datawrapper id={id}/>-->
                    <div class="placeholder"></div>

                {/if}
            {/each}
        </Grid>
    </div>

    <div class="btn">
        <Button buttonClicked={()=>{
            isOpen = !isOpen;
            visibleItems = isOpen ? dataWrapperIds.length : fewItems;
            }} secondary={true}>{buttonText}</Button>
    </div>


</div>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .debug {
    position: absolute;
    bottom: 8px;
    right: 8px;
    color: lightgreen;
    background: black;
    font-size: 14px;
    padding: 3px;
    text-align: right;
  }

  .btn {
    max-width: 77%;
    margin: 20px auto 0;
  }

  .placeholder {
    background: #793a22;
    width: 100%;
    height: 200px;
    box-shadow: red 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
  }

</style>


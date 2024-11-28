<script>

    import Grid from "$components/Grid.svelte";
    import Button from "$components/Button.svelte";
    import Datawrapper from "$components/Datawrapper.svelte";

    const columnMinWidth = 303;

    const fewItems = 4;
    let visibleItems = $state(fewItems);
    const buttonText = $derived(visibleItems === fewItems ? "Show More" : "Show Less");
    const dataWrapperIds = ["cWEvG", "cWEvG", "cWEvG", "cWEvG", "cWEvG", "cWEvG", "cWEvG", "cWEvG", "cWEvG", "cWEvG", "cWEvG"];

</script>

<div class="content">

    <div class="container">
        <Grid --column-min-width="{columnMinWidth}px">
            {#each dataWrapperIds as id, i}
                {#if i < visibleItems }
                    <Datawrapper id={id}/>
                {/if}
            {/each}
        </Grid>
    </div>

    <div class="btn">
        <Button buttonClicked={()=>{
            visibleItems = visibleItems === fewItems ? dataWrapperIds.length || fewItems : fewItems;
            }} secondary={true}>{buttonText}</Button>
    </div>

</div>

<style lang="scss">

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .btn {
    margin: 20px auto 0;
  }

</style>


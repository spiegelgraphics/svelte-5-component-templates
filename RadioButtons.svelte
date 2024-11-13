<script>
    import { fade } from "svelte/transition";

    /**
     * @component
     * RadioButtons
     * 
     * A component that renders a list of radio buttons.
     * 
     * @prop {Array} options - The list of options to display. Each option should be an object with `label` and `key` properties.
     * @prop {Object} selectedOption - The currently selected option. This is a bindable property.
     * @prop {Boolean} isSmall - If true, the radio buttons will be displayed in a column layout.
     * @prop {String|Boolean} preselectedKey - The key of the preselected option. Defaults to false.
     * 
     * @event selectOption - Fired when an option is selected. The event detail contains the selected option's key.
     */
    
    let { 
        options, 
        selectedOption = $bindable({}),
        isSmall,
        preselectedKey = false
    } = $props();

    let selectedKey = $state(preselectedKey);

    const selectOption = (e) => {  
        selectedKey = e.key;
        selectedOption = options.find(d => d.key === selectedKey);
      }
</script>


<div class="options" class:isSmall>
    
    {#each options as {label, key} }
        <button 
            class="option"
            class:selected={selectedKey === key}
            onclick={ () => selectOption({key}) }
            >
            <span class="circle" class:selected={selectedKey === key}>
                {#if selectedKey === key}                        
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" transition:fade={{duration: 200}}>
                        <path d="M8.33331 2L3.66665 8L1.66665 5.33333" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                {/if}
            </span>
            <span>{label}</span>
        </button>
    {/each}

</div>


<style lang="scss">

    .options {
        display: flex;
        position: relative;
        height: auto;
        border-radius: 18px;
        width: 100%;
        flex-direction: row;
        gap: 14px;

        &.isSmall {            
            flex-direction: column;
            gap: 4px;
        }
    }


    .option {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
        transition: all 0.4s;
        color: var(--int-font-color-gray-base);
        font-weight: 700;
        font-size: 18px;
        border-radius: 18px;
        background-color: var(--int-color-gray-fonds);
        padding-left: 7px;
        min-height: 36px;

        &.selected {
            color: #fff;
            background-color: var(--background-color, --int-font-color-link);
        }

        span {
            z-index: 4;
        }

        .circle {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background-color: var(--int-background-color-default);
            margin-right: 7px;
            border: 1px solid var(--int-font-color-shade-base);
            position: relative;
            transition: all 0.4s;

            &.selected {
                border: 1px solid var(--background-color, --int-font-color-link);
                background-color: #fff;
                
                svg {
                    position: absolute;
                    top: 4px;
                    left: 3px;
                    path {
                        stroke: var(--background-color, --int-font-color-link);
                    }
                }
            }
        }
    }

</style>
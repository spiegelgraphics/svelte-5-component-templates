<script>
    import { fade } from "svelte/transition";
    
    /**
     * @component
     * MultipleChoiceButtons
     * 
     * A Svelte component that renders a list of options as buttons. 
     * Allows for single or multiple selections.
     * 
     * @prop {Array} options - The list of options to display. Each option should be an object with `label` and `key` properties.
     * @prop {Array} [selectedOptions=[]] - The list of currently selected options.
     * @prop {boolean} [isSmall=false] - If true, applies a smaller style to the buttons.
     * @prop {Array} [preselectedKeys=false] - The keys of the options that should be preselected.
     * @prop {boolean} [multipleChoice=true] - If true, allows multiple options to be selected.
     * 
     * @event selectOption - Fired when an option is selected or deselected.
     */

    let { 
        options, 
        selectedOptions = $bindable([]),
        isSmall,
        preselectedKeys = false,
        multipleChoice = true,
    } = $props();

    let selectedKeys = $state(preselectedKeys);

    const selectOption = (e) => {  
        if( multipleChoice ) {
            if( selectedKeys.includes(e.key) ) {
                selectedKeys = selectedKeys.filter(d => d !== e.key);
                selectedOptions = selectedOptions.filter(d => d.key !== e.key);
            } else {
                selectedKeys = [...selectedKeys, e.key];
                selectedOptions = [...selectedOptions, options.find(d => d.key === e.key)];
            }
        } else {
            selectedKeys = [e.key];
            selectedOptions = [options.find(d => d.key === e.key)];
        }
      }
</script>


<div class="options" class:isSmall >
    
    {#each options as {label, key} }
        {@const selected = selectedKeys.includes(key)}
        <button 
            class="option"
            class:selected
            onclick={ () => selectOption({key}) }
            >
            <span class="circle" class:selected>
                {#if selected }                        
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
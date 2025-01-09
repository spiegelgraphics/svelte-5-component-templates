<script>
    /**
     * @component
     * GroupedChoiceButtons
     * 
     * A component that renders a group of choice buttons with a highlight indicating the selected option.
     * 
     * @prop {Array} options - The list of options to display. Each option should be an object with `label` and `key` properties.
     * @prop {Object} selectedOption - The currently selected option. This is a bindable property.
     * @prop {String} preselectedKey - The key of the preselected option.
     * 
     * @event selectOption - Fired when an option is selected. The event detail contains the selected option's key.
     */

    let {
        options, 
        selectedOption = $bindable({}),
        preselectedKey
    } = $props();

    let width = $state(0);
    let selectedKey = $state(preselectedKey);
    let buttonWidth = $derived(width / options.length);
    let leftPosition = $derived( options.findIndex(d => d.key === selectedKey) * buttonWidth );

    const selectOption = (e) => {  
        selectedKey = e.key;
    };

    $effect(() => {
        selectedOption = options.find(d => d.key === selectedKey);
    });

</script>


<div class="options" bind:clientWidth={width} >

    <div
        class="highlight"
        style:left={leftPosition+"px"}
        style:width={buttonWidth+"px"}
    ></div>
    
    {#each options as {label, key} }
        {@const selected = selectedKey === key}

        <button 
            class="option"
            class:selected
            onclick={ () => selectOption({key}) }
            >
                <span>{label}</span>
        </button>
    {/each}

</div>


<style lang="scss">
    .options {
        display: flex;
        position: relative;
        height: 36px;
        border-radius: 18px;
        background-color: var(--int-color-gray-fonds);
        width: 100%;

        .option {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s;
            color: var(--int-font-color-gray-base);
            font-weight: 700;
            font-size: 18px;
            &.selected {
                color: #fff;
            }

            span {
                z-index: 4;
            }
        }

        .highlight {
            position: absolute;
            top: 0;
            bottom: 0;
            min-width: 36px;
            background-color: var(--background-color, var(--int-font-color-link));
            border-radius: 18px;
            // transition: all 0.4s cubic-bezier(0.025, 1, 0.5, 1);
            transition: all 0.2s ease-in-out;
            z-index: 2;
            color: transparent;            
        }

        .highlightText {
            background-color: transparent;
            color: transparent;              
            position: absolute;
            top: 0;
            bottom: 0;
        }
    }
</style>

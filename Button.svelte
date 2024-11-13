<script>

	/**
	 * @component
	 * Button component that renders a button with optional text, icon, and various states.
	 *
	 * @prop {HTMLElement} children - The text and/or optional children elements to render inside the button.
	 * @prop {HTMLElement} customIcon - Custom Icon to display on the button.
	 *
	 * @prop {function} buttonClicked - optional function to call when the button is clicked.
	 * @prop {function} url - creates an a-href-Wrap around the Button which links to the URL
	 *
	 * @prop {string} icon - The icon to display on the button. "arrow" (default), "lens", "spiegelplus"
	 * @prop {boolean} disabled - Whether the button is disabled. Default is false.
	 * @prop {boolean} secondary - Whether the button is styled as a secondary button.
	 *
	 * @css {string} --textColor - CSS variable for the text color.
	 * @css {string} --backgroundColor - CSS variable for the background color.
	 * @css {string} --hoverColor - CSS variable for the hover background color.
	 * @css {string} --activeColor - CSS variable for the active background color.
	 * @css {string} --disabledTextColor - CSS variable for the disabled text color.
	 * @css {string} --disabledBackgroundColor - CSS variable for the disabled background color.
	 * @css {string} --fillColor - CSS variable for the fill color of the icons.
	 */

	let {
		url, customIcon, children, icon = "arrow", disabled = false, secondary, buttonClicked = () => {
		}
	} = $props();

</script>


{#snippet button()}
	<button {disabled} onclick={buttonClicked}
	        class:secondary={secondary}>
		<span>{@render children?.()}</span>
		<span>
            {#if customIcon}
                {@render customIcon?.()}
            {:else if icon === "arrow"}

                <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                    <path d="M1.33325 1.66663L4.66659 4.99996L1.33325 8.33329"/>
                </svg>
            {:else if icon === "lens"}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="6" cy="6" r="4.9" stroke-width="2.2"/>
                    <path d="M10 10L14.5 14.5" stroke-width="2.2" stroke-linecap="round"/>
                </svg>
            {:else if icon === "spiegelplus"}
                <svg class="spiegelplus" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                     fill="none">
                    <path
	                    d="M12.7 17.5906V10.5436H7.11051V7.34899H9.90005V9.32215H12.7V6.50336C12.7 5.60133 11.8632 5 11.02 5H5.79896C4.95582 5 4.30005 5.65772 4.30005 6.50336V12.8926H9.88605V16.745H7.01682V14.1141H4.30005V17.4966C4.30005 18.3423 4.95582 19 5.79896 19H11.104C11.9662 19 12.7 18.4362 12.7 17.5906Z"/>
                    <path d="M18 8H20V11H23V13H20V16H18V13H15V11H18V8Z"/>
                </svg>
            {/if}
        </span>
	</button>

{/snippet}

{#if url}
	<a href={url} target="_top">
		{@render button()}
	</a>
{:else}
	{@render button()}
{/if}


<style lang="scss">

	@use './../scss/config';

	button {
		width: 100%;
		@include config.fontFamily(config.$spSansBold);
		color: var(--textColor, #{config.$basic-white});
		height: 44px;
		border-radius: config.$spBorderRadius;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 13px 13px 13px 17px;
		cursor: pointer;
		border: none;
		justify-content: space-between;

		background: var(--backgroundColor, #{config.$primary-base});
		@media (prefers-color-scheme: dark) {
			background-color: var(--backgroundColorDark, #{config.$primary-base-dark});
		}

		span:nth-child(2) {
			padding-left: 13px;
		}

		svg {
			display: block;
			vertical-align: middle;
		}

		path, circle {
			stroke: var(--textColor, #{config.$basic-white});
			fill: var(--fillColor, transparent);
			stroke-width: 1.5;
			stroke-linecap: round;
		}

		&:hover {
			background: var(--hoverColor, #{config.$primary-dark});
		}

		&:active {
			background: var(--activeColor, #{config.$primary-darker});
		}

		&:disabled {
			path, circle {
				stroke: var(--disabledTextColor, #{config.$basic-gray-dark});
			}

			pointer-events: none;
			color: var(--disabledTextColor, #{config.$basic-gray-dark});
			background-color: var(--disabledBackgroundColor, #{config.$shade-lighter});
		}

		&.secondary {
			border: 1px solid;
			color: var(--int-font-color-default);
			border-color: var(--int-font-color-shade-base);
			background-color: transparent;

			&:hover {
				border-color: var(--int-font-color-default);
			}

			&:active {
				background-color: var(--int-font-color-shade-lightest);
			}

			&:disabled {
				opacity: 0.23; // TODO !== Figma
			}
		}

		.spiegelplus path {
			fill: var(--textColor, #{config.$basic-white});
			stroke: transparent;
		}
	}
</style>

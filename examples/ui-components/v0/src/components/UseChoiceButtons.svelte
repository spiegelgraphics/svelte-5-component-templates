<script>
	import ChoiceButtons from '../../../../../ChoiceButtons.svelte';


	let {
		data = {}
	} = $props();


	const { weekDays } = data;
	const weekdayOptions = weekDays.map(({ abr_2, key }) => ({ label: abr_2, key }));
	const disabledOptions = weekdayOptions.slice(5, 7);
	const isSmall = false;

	let selectedWeekdays = $state(weekdayOptions.slice(0, 5));
</script>


{#snippet weekdayOptionRenderer(label, selected, disabled)}
	<div class="option-weekdays" class:selected class:disabled>
		<span>{label}</span>
	</div>
{/snippet}


<ChoiceButtons
	--button-min-width="70px"
	--button-font-size="1.25rem"
	options={weekdayOptions}
	{disabledOptions}
	{isSmall}
	XoptionRenderer={weekdayOptionRenderer}
	bind:selectedOptions={selectedWeekdays}
/>
<div class="output">
	Ausgewählte Tage: {selectedWeekdays.map(d => d.label).join(', ')}
</div>


<style lang="scss">
	@use "./../scss/config";

	div {
		//--button-bg-selected: red;
		@media (prefers-color-scheme: dark) {
			--button-bg-selected: yellow;
			--button-color-selected: #444;
			--button-icon-bg-selected: #444;
		}
	}

	.option-weekdays {
		width: 80px;
		height: 80px;
		background-color: purple;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: var(--button-font-size);

		&.selected {
			border-radius: 50%;
		}

		&.disabled {
			background-color: pink;
			color: hotpink;
		}
	}

	.output {
		margin: 1rem 0;
		@include config.fontFamily(config.$spSerifItalic);
	}

</style>

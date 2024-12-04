<script>
	import UseChoiceButtons from '$components/UseChoiceButtons.svelte';
	import TestComponent from '$components/TestComponent.svelte';


	let {
		data = {}
	} = $props();
</script>


<div>

	<TestComponent name="ChoiceButtons" tip='"X" and un-"X" the property "optionRenderer"'>
		<UseChoiceButtons {data} />
	</TestComponent>

	<!-- TestAndereButtons -->

</div>


<style lang="scss">
	@use "./../scss/config";
</style>

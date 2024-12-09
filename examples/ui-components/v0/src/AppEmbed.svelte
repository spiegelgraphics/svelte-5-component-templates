<script>
  import Content from '$components/Content.svelte';
</script>

<div class="gsa" data-type="graphics-svelte-app">
  <Content />
</div>

<style lang="scss">
	@use "./scss/config";

  .gsa {
	  padding-bottom: 0.125rem;
	  @include config.appBaseFont;
	  @include config.appBaseColors;
	  @include config.cssVars;
  }
</style>

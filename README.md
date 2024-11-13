# svelte-5-component-templates
DER SPIEGEL Svelte 5 Component Templates


# TabNavigation

```html
<script>
  const naviConfig = [
    {label: 'Tab 1', ix: 0},
    {label: 'Tab 2', ix: 1},
    {label: 'Tab 3', ix: 2}
  ];
  let currentOption = $state({ value: naviConfig[0] });
  // TabNavigation ohne vorausgewählten Tab:
  // let currentOption = $state({value: {}});
</script>

<TabNavigation config={naviConfig} bind:currentOption />

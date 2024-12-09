import { getScriptTag } from '$lib/util/getCurrentScriptTag';
import { mount } from 'svelte';
import App from './AppEmbed.svelte';

const scriptTag = getScriptTag(import.meta);

mount(App, {
  target: scriptTag.previousElementSibling,
});

//export default app

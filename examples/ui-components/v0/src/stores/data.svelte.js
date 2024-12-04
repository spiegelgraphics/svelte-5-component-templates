import { json } from 'd3-fetch';
import { params } from '$utils/params.js';


class Data {

	#raw = $state({});

	constructor() {
		const { dataUrl = '', data = '' } = params;

		if (!dataUrl && !data) {
			console.error('No dataUrl provided in params');
			return;
		}
		json(dataUrl || data).then((d) => {
			// console.log('%c data ', 'background:red;color:white', d);
			this.#raw = d.json_output;
		});
	}

	weekDays = $derived(this.#raw.weekDays || {});

	allDatasets = $derived(this.#raw || {});

	loaded = $derived(Object.keys(this.#raw).length > 0);

}

export const data = new Data();

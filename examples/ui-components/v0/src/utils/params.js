import { autoType } from 'd3-dsv';

const paramsAttribute = 'data-params';

const defaultParams = {
	data: 'data/asset.json',
};

const urlParamsObj = new URLSearchParams(window.location.search);
const urlParams = Object.fromEntries(urlParamsObj);
const wrapParams =
	JSON.parse(
		document?.currentScript?.parentNode?.getAttribute(paramsAttribute) || '{}'
	) || {};

export const params = {
	...defaultParams,
	...autoType(wrapParams),
	...autoType(urlParams),
};

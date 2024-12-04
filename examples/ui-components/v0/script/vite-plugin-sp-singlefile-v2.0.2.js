import micromatch from "micromatch";


const getIIFE = code => `(()=>{${code}})()`;

const getEmbedHTMLFragment = html => {
	// Doctype, SP-CSS und <head/> finden, um sie zu entfernen
	const rxHead = /<!DOCTYPE.+(?:\r?\n)*(?:\s*.+(?:\r?\n))*<\/head>(\r?\n)*/gmi;
	const rxBody = /(?:<body[^>]*>|<\/body>)/gmi;
	// div svelte-app finden, um  dev-data-params zu entfernen
	//  class="graphics-svelte-wrap" data-type="svelte-app"
	const rxSvelteDiv = /\s*(<div class="graphics-svelte-wrap" data-type="svelte-app").+>/m;
	html = html.replace(rxHead, "");
	html = html.replace(rxBody, "");
	return html.replace(rxSvelteDiv, "$1>");
};


const defaultConfig = { useRecommendedBuildConfig: true, removeViteModuleLoader: true, deleteInlinedFiles: true };

export function replaceScript(html, scriptFilename, scriptCode, removeViteModuleLoader = false) {
	const reScript = new RegExp(`<script([^>]*?) src="[./]*${scriptFilename}"([^>]*)></script>`);
	const preloadMarker = /"?__VITE_PRELOAD__"?/g;
	const newCode = `<script>\n${getIIFE(scriptCode.replace(preloadMarker, "void 0"))}\n</script>`;

	let inlined = html.replace(reScript, "");

	// HTML-Kommentare werden entfernt, daher als Platzhalter ungeeignet
	// Custom HMTL-Element in index.html erbt keine Eigenschaften und nicht keinen Platz ein
	const parts = inlined.split("<js-placeholder></js-placeholder>");


	inlined = parts[0] + newCode + parts[1];
	// Parameter "import.meta" für Dev wichtig, in der Modul-losen Live-Variante ein Fehler
	// => aus kombinierten und minifizierten Code entfernen
	inlined = inlined.replace("(import.meta)", "()");


	return removeViteModuleLoader ? _removeViteModuleLoader(inlined) : inlined;
}

export function replaceCss(html, scriptFilename, scriptCode, isEmbed) {
	const reStyle = new RegExp(`<link([^>]*?) href="[./]*${scriptFilename}"([^>]*?)>`);
	const searchValue = isEmbed ? "<css-placeholder></css-placeholder>" : reStyle;
	const legacyCharSetDeclaration = /@charset "UTF-8";/;
	scriptCode = scriptCode.replace(legacyCharSetDeclaration, ""); // chart-set nicht benötigt, da hier kein css-file
	return html.replace(searchValue, `<style>\n${scriptCode}</style>`);
}

const isJsFile = /\.[mc]?js$/;
const isCssFile = /\.css$/;
const isHtmlFile = /\.html?$/;

export function viteSingleFile({
												useRecommendedBuildConfig = true,
												removeViteModuleLoader = false,
												inlinePattern = [],
												deleteInlinedFiles = true,
												target = "iframe"
	} = defaultConfig) {

	function warnNotInlined(filename) {
		console.debug(`NOTE: asset not inlined: ${filename}`);
	}

	const isEmbed = target === "embed";
	console.log("Build > target:", target, " > isEmbed: ", isEmbed);

	return {
		name: "vite:singlefile",
		config: useRecommendedBuildConfig ? _useRecommendedBuildConfig : undefined,
		enforce: "post",
		generateBundle: (_, bundle) => {
			const files = {
				html: [],
				css: [],
				js: [],
				other: []
			};
			for (const i of Object.keys(bundle)) {
				if (isHtmlFile.test(i)) {
					files.html.push(i);
				} else if (isCssFile.test(i)) {
					files.css.push(i);
				} else if (isJsFile.test(i)) {
					files.js.push(i);
				} else {
					files.other.push(i);
				}
			}
			const bundlesToDelete = [];
			for (const name of files.html) {
				const htmlChunk = bundle[name];
				let replacedHtml = htmlChunk.source;
				for (const filename of files.js) {
					if (inlinePattern.length && !micromatch.isMatch(filename, inlinePattern)) {
						warnNotInlined(filename);
						continue;
					}
					const jsChunk = bundle[filename];
					if (jsChunk.code !== null) {
						console.debug(`Inlining: ${filename}`);
						bundlesToDelete.push(filename);
						replacedHtml = replaceScript(replacedHtml, jsChunk.fileName, jsChunk.code, removeViteModuleLoader);
					}
				}
				for (const filename of files.css) {
					if (inlinePattern.length && !micromatch.isMatch(filename, inlinePattern)) {
						warnNotInlined(filename);
						continue;
					}
					const cssChunk = bundle[filename];
					console.debug(`Inlining: ${filename}`);
					bundlesToDelete.push(filename);
					replacedHtml = replaceCss(replacedHtml, cssChunk.fileName, cssChunk.source, isEmbed);
				}

				if (isEmbed) {
					replacedHtml = getEmbedHTMLFragment(replacedHtml);
				}
				htmlChunk.source = replacedHtml;

			}
			if (deleteInlinedFiles) {
				for (const name of bundlesToDelete) {
					delete bundle[name];
				}
			}
			for (const name of files.other) {
				warnNotInlined(name);
			}
		},
	};
}

// Optionally remove the Vite module loader since it's no longer needed because this plugin has inlined all code.
// This assumes that the Module Loader is (1) the FIRST function declared in the module, (2) an IIFE, (4) is within
// a script with no unexpected attribute values, and (5) that the containing script is the first script tag that
// matches the above criteria. Changes to the SCRIPT tag especially could break this again in the future. It should
// work whether `minify` is enabled or not.
// Update example:
// https://github.com/richardtallent/vite-plugin-singlefile/issues/57#issuecomment-1263950209
const _removeViteModuleLoader = (html) =>
	html.replace(/(<script type="module" crossorigin>\s*)\(function(?: polyfill)?\(\)\s*\{[\s\S]*?\}\)\(\);/, '<script type="module">');

// Modifies the Vite build config to make this plugin work well.
const _useRecommendedBuildConfig = (config) => {
	if (!config.build) config.build = {};
	// Ensures that even very large assets are inlined in your JavaScript.
	config.build.assetsInlineLimit = () => true;
	// Avoid warnings about large chunks.
	config.build.chunkSizeWarningLimit = 100000000;
	// Emit all CSS as a single file, which `vite-plugin-singlefile` can then inline.
	config.build.cssCodeSplit = false;
	// We need relative path to support any static files in public folder,
	// which are copied to ${build.outDir} by vite.
	config.base = "./";
	// Make generated files in ${build.outDir}'s root, instead of default ${build.outDir}/assets.
	// Then the embedded resources can be loaded by relative path.
	config.build.assetsDir = "";

	if (!config.build.rollupOptions) config.build.rollupOptions = {};
	if (!config.build.rollupOptions.output) config.build.rollupOptions.output = {};

	const updateOutputOptions = (out) => {
		// Ensure that as many resources as possible are inlined.
		out.inlineDynamicImports = true;
	};

	if (Array.isArray(config.build.rollupOptions.output)) {
		for (const o of config.build.rollupOptions.output) updateOutputOptions(o);
	} else {
		updateOutputOptions(config.build.rollupOptions.output);
	}
};

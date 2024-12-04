import path, {dirname} from "node:path";
import {readFileSync, writeFile} from "node:fs";
import {fileURLToPath} from "node:url";
// import {Buffer} from "node:buffer";
// import {randomUUID} from "node:crypto";


const defaultConfig = {useRecommendedBuildConfig: true, removeViteModuleLoader: true, deleteInlinedFiles: true};

export function viteSpWebComponent({
							useRecommendedBuildConfig = true,
							deleteInlinedFiles = true,
							template = "template.app.swc.html",
							output = "index.embed.swc.html"
         } = defaultConfig) {


	const __dirname = dirname(fileURLToPath(import.meta.url));
	const dirProject = path.resolve(__dirname, "./../");
	const dirProjectBuild = path.resolve(dirProject, "dist");
	const fileTemplate = path.resolve(dirProject, `${template}`);
	const fileOutput = path.resolve(dirProjectBuild, (output || "index.embed.swc.html"));
	const isJsFile = /\.[mc]?js$/;
	const isCssFile = /\.css$/;
	const nameProject = dirProject.split(path.sep).splice(-2, 2).join("/");
	// const uuid = Buffer.from(nameProject, "utf8").toString("base64");
	// const uuid = randomUUID();
	// let codeOutput = "";

	console.log(`Build: swc - SPIEGEL Web Component "${nameProject}"`);

	let codeOutput = readFileSync(fileTemplate, {encoding: 'utf8'});


	return {
		name: "vite:SpWebComponent",
		config: useRecommendedBuildConfig ? _useRecommendedBuildConfig : undefined,
		enforce: "post",
		generateBundle: (_, bundle) => {

			const bundlesToDelete = [];
			const files = {
				css: [],
				js: [],
				other: []
			};

			for (const i of Object.keys(bundle)) {
				if (isCssFile.test(i)) {
					files.css.push(i);
				} else if (isJsFile.test(i)) {
					files.js.push(i);
				} else {
					files.other.push(i);
				}
			}
			// console.log("Files: ", files);

			for (const cssName of files.css) {
				const cssChunk = bundle[cssName];
				if (cssChunk.code !== null) {
					bundlesToDelete.push(cssName);
					codeOutput = codeOutput.replace("/* MINCSS */", cssChunk.source.replace("\n", "").replace("@charset \"UTF-8\";", ""));
				}
			}

			for (const jsName of files.js) {
				const jsChunk = bundle[jsName];
				if (jsChunk.code !== null) {
					bundlesToDelete.push(jsName);
					const {code} = jsChunk;
					let jsCode = code.replace(/^var\s/, "let ");

					// ???
					// Immer mal wieder Probleme mit replace-Methode
					// > daher hier ein Workaround (fk)
					const parts = codeOutput.split("/* MINJS */");
					codeOutput = parts[0] + jsCode + parts[1];
				}
			}

			writeFile(fileOutput, codeOutput, err => {
				if (err) {
					console.error(err);
					return;
				}
				//file written successfully
				console.log("Output: ", fileOutput);
			});

			if (deleteInlinedFiles) {
				for (const name of bundlesToDelete) {
					delete bundle[name];
				}
			}

			for (const name of files.other) {
				console.log("Nicht verarbeitet: ", name);
			}

		}
	};

}

// Modifies the Vite build config to make this plugin work well.
const _useRecommendedBuildConfig = (config) => {
	if (!config.build)
		config.build = {};
	// Ensures that even very large assets are inlined in your JavaScript.
	config.build.assetsInlineLimit = 100000000;
	// Avoid warnings about large chunks.
	config.build.chunkSizeWarningLimit = 100000000;
	// Emit all CSS as a single file, which `vite-plugin-singlefile` can then inline.
	config.build.cssCodeSplit = false;
	// Avoids the extra step of testing Brotli compression, which isn't really pertinent to a file served locally.
	config.build.reportCompressedSize = false;
	// Subfolder bases are not supported, and shouldn't be needed because we're embedding everything.
	config.base = undefined;
	if (!config.build.rollupOptions)
		config.build.rollupOptions = {};
	if (!config.build.rollupOptions.output)
		config.build.rollupOptions.output = {};
	const updateOutputOptions = (out) => {
		// Ensure that as many resources as possible are inlined.
		out.inlineDynamicImports = true;
	};
	if (Array.isArray(config.build.rollupOptions.output)) {
		for (const o in config.build.rollupOptions.output)
			updateOutputOptions(o);
	} else {
		updateOutputOptions(config.build.rollupOptions.output);
	}
};

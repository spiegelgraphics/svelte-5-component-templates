import process from 'node:process';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';
import { ViteAliases } from 'vite-aliases';
import { createHtmlPlugin } from 'vite-plugin-html';
import terser from '@rollup/plugin-terser';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from './../script/vite-plugin-sp-singlefile-v2.0.2.js';
import { viteSpWebComponent } from './../script/vite-plugin-build-sp-web-component.v0.js';
import { projectConfig } from './../project.config.json';

// https://vitejs.dev/config/

const __dirname = path.resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const {
	htmlFile,
	htmlDev,
	htmlData,
	port,
	buildTarget,
	swcTemplate,
	swcOutput = 'index.embed.swc.html',
	entryPointWebComponent
} = projectConfig;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const htmlFileDev = htmlDev || htmlFile;
const production = process.env.NODE_ENV === 'production';
const isWebComponent = buildTarget === 'swc';

export default defineConfig({
	plugins: [
		svelte({
			emitCss: true,
			preprocess: vitePreprocess(),
			compilerOptions: {
				dev: !production,
				hmr: !production
			},
			onwarn(warning, defaultHandler) {
				// don't warn on slow builds and poor dx
				if (warning.code === 'vite-plugin-svelte-preprocess-many-dependencies') return;
				// handle all other warnings normally
				defaultHandler(warning);
			}
		}),
		ViteAliases({
			prefix: '$',
			createLog: false,
			useConfig: false,
			root: process.cwd()
		}),
		!production ? null : isWebComponent ?
			viteSpWebComponent({
				target: buildTarget,
				deleteInlinedFiles: false,
				template: swcTemplate,
				output: swcOutput
			})
			:
			viteSingleFile({ target: buildTarget }),
		createHtmlPlugin({
			minify: true,
			template: htmlFileDev,
			inject: { data: htmlData }
		}),
		createHtmlPlugin({
			minify: true,
			template: htmlFileDev,
			inject: { data: htmlData }
		})
	],
	server: {
		host: false,
		port
	},
	build: {
		sourcemap: !production,
		target: "es2017",
		minify: production ? "terser" : false,
		assetsInlineLimit: 100000000,
		chunkSizeWarningLimit: 100000000,
		cssCodeSplit: false,
		// brotliSize: false,
		outDir: path.resolve(__dirname, "dist"),
		rollupOptions: {
			plugins: [
				terser({
					compress: {
						defaults: true,
						drop_console: true,
						ecma: 2017
					},
					format: {
						comments: false,
						ecma: 2017
					}
				})
			],
			output: {
				inlineDynamicImports: true,
				// manualChunks: () => "everything.js"
			},
			input: {
				// index: path.resolve(__dirname, htmlFile)
				// index: path.resolve(__dirname, "src/",  entryPointWebComponent)
				index: isWebComponent ?
					path.resolve(__dirname, "src",  entryPointWebComponent)
					// path.resolve(__dirname, entryPointWebComponent)
					:
					path.resolve(__dirname, htmlFile)
				// about: path.resolve(__dirname, 'src/about.html')
			}/*,
			resolve: {
				alias: [{
					find: '@lib',
					replacement: "C:/WorkplaceGit/apps/_lib/es6"
				}],
				extensions: ['.mjs', '.js', '.svelte'],
				mainFields: ['svelte', 'browser', 'module', 'main']
			}*/
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler' // or "modern"
			}
		},
		postcss: {
			plugins: [
				autoprefixer()
			]
		}
	}
});

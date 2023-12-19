import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
//import { HstSvelte } from '@histoire/plugin-svelte';
//import inject from '@rollup/plugin-inject';
//import { polyfillNode } from 'esbuild-plugin-polyfill-node';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig(({ mode }) => ({
	plugins: [
		nodePolyfills({globals: {
			Buffer: true,
			process: true
		}}),
		sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	/*
	define: {
		'process.env.NODE_ENV': mode === 'production' ? '"production"' : '"development"'
	},*/
	build: {
		rollupOptions: {
			cache: false,
			plugins: [
				/*
				inject({
					//include: ['ethereumjs-util'],

					modules: {
						Buffer: ['buffer', 'Buffer'],
						process: 'process'
					}
				})
				*/
			]
		}
	},
	optimizeDeps: {
		//include: ["ethereumjs-util"],
		//exclude: ["ethereumjs-util"],
		esbuildOptions: {
			define: {
				global: 'globalThis',
				'process.env': JSON.stringify({}),
				'process.env.DEBUG': JSON.stringify(mode === 'production' ? 'production' : 'development')
			}
			/*
			plugins: [
				polyfillNode({
					globals: {
						buffer: true,
						process: true
					}
				})
			]*/
		}
	},
	resolve: {
		alias: {
			// process: "process"
		}
	}
}));

/*
	histoire: {
		plugins: [HstSvelte()],
		setupFile: './src/histoire-setup.js'
	}*/

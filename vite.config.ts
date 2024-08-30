import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import EnvironmentPlugin from 'vite-plugin-environment';
import fs from 'fs';


// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
	// if (command === 'serve') {
	// 	return {
	// 		plugins: [react(), EnvironmentPlugin(['DISABLE_ESLINT_PLUGIN', 'PORT', 'REACT_EDITOR', 'VITE_BASE_URL', 'VITE_BASE_IOT_DEV', 'VITE_BASE_IOT_PORT_DEV'])],
	// 		assetsInclude: ['**/*.md'],
	// 	}
	// } else {
	// 	return {
	// 		plugins: [react(), EnvironmentPlugin(['DISABLE_ESLINT_PLUGIN', 'PORT', 'REACT_EDITOR', 'VITE_BASE_URL_PROD', 'VITE_BASE_IOT_PROD', 'VITE_BASE_IOT_PORT_PROD'])],
	// 		assetsInclude: ['**/*.md'],
	// 	}
	// }
	const env = loadEnv(mode, process.cwd())
	return {
		// vite config
		plugins: [react(), EnvironmentPlugin('all')],
		assetsInclude: ['**/*.md'],
		// define: {
		// 	__APP_ENV__: JSON.stringify(env.APP_ENV),
		// 	'process.env': process.env
		// },
		server: {
			// proxy: {
			// 	'/api': {
			// 	target: 'https://mindicador.cl/',
			// 	changeOrigin: false,
			// 	rewrite: (path) => path.replace(/^\/api/, ''),
			// 	},
			// },
    },
	}
})



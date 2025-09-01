import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    // For GitHub Pages deployment
    const isGitHubPages = process.env.GITHUB_PAGES === 'true'
    // For local development
    const isDev = command === 'serve' && mode !== 'production'
    
    return {
        // Only use '/portfolio/' base for GitHub Pages production build
        // Use '/' for all local development and preview
        base: isGitHubPages ? '/portfolio/' : '/',
        plugins: [react()],
        build: {
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            // Split the swiper plugin library into a separate chunk to avoid a large chunk size on index.js
                            if (id.includes('swiper'))
                                return 'swiper';
                            return;
                        }
                    }
                }
            }
        },
        css: {
            preprocessorOptions: {
                scss: {
                    silenceDeprecations: ["mixed-decls", "color-functions", "global-builtin", "import"],
                },
            },
        },
    }
})

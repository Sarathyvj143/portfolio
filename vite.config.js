import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    // Determine if we're in a GitHub Actions environment
    const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
    // Base path - use repo name in GitHub Actions, root path elsewhere
    const base = isGitHubActions ? '/portfolio/' : '/'
    
    return {
        // Set the base path according to environment
        base,
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

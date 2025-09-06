/**
 * Helper functions for working with asset paths for GitHub Pages SPA
 */

/**
 * Returns the base URL for the application
 * Takes into account development vs GitHub Pages environment
 * 
 * @return {String} The base URL to use for asset paths
 */
export function getBaseUrl() {
    // Check if we're in development mode by checking hostname
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1') {
        return '';
    }
    
    // For GitHub Pages, we need to use the repository name as the base path
    // This should match the 'base' value in vite.config.js
    return '/portfolio';
}

/**
 * Builds a complete URL for an asset, compatible with GitHub Pages SPA
 * 
 * @param {String} path - The path to the asset (should start with a slash)
 * @return {String} The complete URL
 */
export function getAssetUrl(path) {
    // If path is empty or null, return empty string
    if (!path) return '';
    
    // If path is already a full URL, return it as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    
    // Make sure path starts with a slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // Build the complete URL with base path
    const url = `${getBaseUrl()}${normalizedPath}`;
    
    console.log(`Asset helper: converted ${path} to ${url}`);
    return url;
}

/**
 * Checks if the application is running on GitHub Pages
 * 
 * @return {Boolean} True if running on GitHub Pages, false otherwise
 */
export function isGitHubPages() {
    return window.location.hostname !== 'localhost' && 
           window.location.hostname !== '127.0.0.1';
}

/**
 * Creates a URL suitable for GitHub Pages SPA routing
 * 
 * @param {String} path - The path to convert (e.g., '/blog')
 * @param {Object} params - Optional query parameters to add
 * @return {String} The SPA-compatible URL
 */
export function createSpaUrl(path, params = {}) {
    const base = getBaseUrl();
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // Start building the SPA URL
    let spaUrl = `${base}/?/${cleanPath}`;
    
    // Add query parameters if any
    if (Object.keys(params).length > 0) {
        const queryString = Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        
        spaUrl += `?${queryString}`;
    }
    
    console.log(`SPA URL helper: converted ${path} to ${spaUrl}`);
    return spaUrl;
}

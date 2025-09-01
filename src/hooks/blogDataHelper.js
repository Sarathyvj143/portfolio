/**
 * Helper functions for processing blog data
 */

/**
 * Ensures blog items have proper blogData access
 * This function takes items that might be ArticleItemDataWrapper instances
 * and ensures they have the blogData property correctly set
 * 
 * @param {Array} items - Array of blog items or ArticleItemDataWrapper instances
 * @param {Object} dataWrapper - The parent ArticleDataWrapper instance
 * @return {Array} - Enhanced items with blogData property
 */
export function processBlogItems(items, dataWrapper) {
    if (!items || !items.length) {
        console.warn("No blog items to process");
        return [];
    }
    
    console.log("Processing blog items:", items);
    
    // If we have access to the raw data, build a map of blog IDs
    let blogIdMap = {};
    
    if (dataWrapper && dataWrapper._rawData && dataWrapper._rawData.items) {
        const rawItems = dataWrapper._rawData.items;
        
        // Create a mapping of item ID to blogData
        rawItems.forEach(item => {
            if (item.id && item.blogData) {
                blogIdMap[item.id] = item.blogData;
            }
        });
        
        console.log("Created blog ID map:", blogIdMap);
    }
    
    // Process each item to ensure it has blogData
    return items.map(item => {
        // If item already has valid blogData, keep it as is
        if (item.blogData && item.blogData.id) {
            return item;
        }
        
        // Try to get blogData from the map
        if (blogIdMap[item.id]) {
            // Create a new object with the blogData properly set
            return {
                ...item,
                blogData: blogIdMap[item.id]
            };
        }
        
        // If all else fails, try to extract blogData from raw data
        if (item._rawData && item._rawData.blogData) {
            return {
                ...item,
                blogData: item._rawData.blogData
            };
        }
        
        // If we couldn't find blogData, return the item unchanged
        return item;
    });
}

/**
 * Extracts the blog ID from an item, trying various methods
 * 
 * @param {Object} item - A blog item
 * @return {String|null} - The blog ID or null if not found
 */
export function getBlogIdFromItem(item) {
    if (!item) return null;
    
    // Method 1: Direct access
    if (item.blogData && item.blogData.id) {
        return item.blogData.id;
    }
    
    // Method 2: Via raw data
    if (item._rawData && item._rawData.blogData && item._rawData.blogData.id) {
        return item._rawData.blogData.id;
    }
    
    // Method 3: Try to find from the article wrapper
    if (item.articleWrapper && 
        item.articleWrapper._rawData && 
        item.articleWrapper._rawData.items) {
        
        const originalItem = item.articleWrapper._rawData.items.find(
            origItem => origItem.id === item.id
        );
        
        if (originalItem && originalItem.blogData && originalItem.blogData.id) {
            return originalItem.blogData.id;
        }
    }
    
    // No blog ID found
    return null;
}

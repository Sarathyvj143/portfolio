import "./Blog.scss"
import React, { useState, useEffect } from 'react'
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import {useLocation} from "/src/providers/LocationProvider.jsx"
import BlogList from "/src/components/articles/BlogList.jsx"
import BlogPost from "/src/components/blogpost/BlogPost.jsx"
import { processBlogItems } from "/src/hooks/blogDataHelper.js"

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {Number} id
 * @return {JSX.Element}
 * @constructor
 */
function Blog({ dataWrapper, id }) {
    const language = useLanguage()
    const location = useLocation()
    const [currentView, setCurrentView] = useState('list')
    const [selectedBlogId, setSelectedBlogId] = useState(null)
    const [blogItems, setBlogItems] = useState([])

    // Process the items from the dataWrapper to ensure blogData is accessible
    useEffect(() => {
        if (dataWrapper) {
            const items = dataWrapper.orderedItems || [];
            const processedItems = processBlogItems(items, dataWrapper);
            setBlogItems(processedItems);
        }
    }, [dataWrapper]);

    useEffect(() => {
        // Check if we're viewing a specific blog post
        const urlParams = new URLSearchParams(window.location.search)
        const blogId = urlParams.get('blogId')
        
        // Also check for GitHub Pages SPA routing format
        // For GitHub Pages with SPA routing, the URL might look like /?/blog?blogId=some-id
        // Extract the blogId from pathname (format: /?/path?blogId=some-id)
        const pathname = window.location.pathname
        const hash = window.location.hash
        
        // Check for SPA format in pathname or hash
        let spaBlogId = null
        if (pathname.includes('/?/')) {
            const pathMatch = pathname.match(/\/\?\/(.+)/)
            if (pathMatch && pathMatch[1] && pathMatch[1].includes('blogId=')) {
                const params = new URLSearchParams(pathMatch[1].split('?')[1])
                spaBlogId = params.get('blogId')
            }
        } else if (hash && hash.includes('blogId=')) {
            const hashParams = new URLSearchParams(hash.substring(1))
            spaBlogId = hashParams.get('blogId')
        }
        
        // Use either the regular blogId or the SPA format blogId
        const finalBlogId = blogId || spaBlogId
        
        console.log("Blog: URL check - regular blogId:", blogId, "SPA blogId:", spaBlogId)
        
        if (finalBlogId) {
            setSelectedBlogId(finalBlogId)
            setCurrentView('post')
        } else {
            setCurrentView('list')
            setSelectedBlogId(null)
        }
    }, [location.currentSection])

    const handleBlogSelect = (blogId) => {
        console.log("Blog: handleBlogSelect called with blogId:", blogId);
        setSelectedBlogId(blogId)
        setCurrentView('post')
        
        // Update URL without page reload - for single-page applications
        // We'll add the blogId as a query parameter
        const currentPath = window.location.pathname;
        
        // For GitHub Pages SPA routing compatibility, check if we're using the SPA format
        const isGitHubPages = window.location.hostname !== 'localhost' && 
                              window.location.hostname !== '127.0.0.1';
        
        let newUrl;
        if (isGitHubPages && (currentPath.includes('/?/') || currentPath.endsWith('/'))) {
            // GitHub Pages SPA format
            if (currentPath.includes('/?/')) {
                // Extract the base part and add our query parameter
                const basePath = currentPath.split('/?/')[0];
                newUrl = `${basePath}/?/blog?blogId=${blogId}`;
            } else {
                // Just append to the current path
                newUrl = `${currentPath}?/blog?blogId=${blogId}`;
            }
        } else {
            // Standard format for local development
            newUrl = `${currentPath}${currentPath.endsWith('/') ? '' : '/'}?blogId=${blogId}`;
        }
        
        console.log("Blog: Updating URL to:", newUrl);
        // Use history.pushState to update the URL without a page reload
        window.history.pushState({ blogId }, '', newUrl)
    }

    const handleBackToList = () => {
        setCurrentView('list')
        setSelectedBlogId(null)
        
        // Update URL without page reload - remove the query parameter
        const currentPath = window.location.pathname;
        
        // For GitHub Pages SPA routing compatibility
        const isGitHubPages = window.location.hostname !== 'localhost' && 
                              window.location.hostname !== '127.0.0.1';
        
        let newUrl;
        if (isGitHubPages && currentPath.includes('/?/')) {
            // For GitHub Pages SPA, just go back to the base path with the SPA format
            const basePath = currentPath.split('/?/')[0];
            newUrl = `${basePath}/?/blog`;
        } else {
            // Standard format for local development
            newUrl = currentPath;
        }
        
        window.history.pushState({}, '', newUrl)
    }

    // Listen for browser back/forward buttons
    useEffect(() => {
        const handlePopState = (event) => {
            if (event.state && event.state.blogId) {
                setSelectedBlogId(event.state.blogId)
                setCurrentView('post')
            } else {
                setCurrentView('list')
                setSelectedBlogId(null)
            }
        }

        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [])

    if (currentView === 'post' && selectedBlogId) {
        return (
            <div className="blog-section">
                <BlogPost 
                    blogId={selectedBlogId}
                    onBack={handleBackToList}
                />
            </div>
        )
    }
    
    return (
        <div className="blog-section">
            <BlogList 
                items={blogItems}
                description={dataWrapper.locales?.description}
                onBlogSelect={handleBlogSelect}
            />
        </div>
    )
}

export default Blog

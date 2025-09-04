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
    const [lastNavigationTime, setLastNavigationTime] = useState(0)

    // Process the items from the dataWrapper to ensure blogData is accessible
    useEffect(() => {
        if (dataWrapper) {
            const items = dataWrapper.orderedItems || [];
            const processedItems = processBlogItems(items, dataWrapper);
            setBlogItems(processedItems);
        }
    }, [dataWrapper]);

    // Function to extract blog ID from URL search params
    const getBlogIdFromUrl = () => {
        // 1. Check URL search parameters (most common case)
        const searchParams = new URLSearchParams(window.location.search);
        const urlBlogId = searchParams.get('blogId');
        
        // 2. Check URL hash for direct links
        const hash = window.location.hash;
        let hashBlogId = null;
        
        // Special handling for combined format: ?blogId=xxx#blog
        if (urlBlogId && hash === '#blog') {
            console.log("Blog: Found direct blog post link with section hash:", urlBlogId);
            return {
                blogId: urlBlogId,
                isPostView: true,
                isDirectLink: true
            };
        }
        
        // Handle hash-only format that contains blogId parameter
        if (hash && hash.includes('blogId=')) {
            let paramsPart = '';
            
            // Handle different hash formats:
            // #blog?blogId=xxx
            if (hash.includes('?')) {
                paramsPart = hash.substring(hash.indexOf('?') + 1);
            } 
            // #?blogId=xxx or #blogId=xxx
            else if (hash.includes('=')) {
                paramsPart = hash.substring(1); // Remove the # character
            }
            
            if (paramsPart) {
                const hashParams = new URLSearchParams(paramsPart);
                hashBlogId = hashParams.get('blogId');
                console.log("Blog: Found blogId in hash:", hashBlogId);
            }
        }
        
        // 3. Return the first valid blog ID found
        const blogId = urlBlogId || hashBlogId;
        
        return {
            blogId,
            isPostView: !!blogId,
            isDirectLink: !!urlBlogId && hash === '#blog'
        };
    }

    // CRITICAL: This useEffect runs whenever the section changes
    useEffect(() => {
        // Only run this when we're in the blog section
        if (location.currentSection !== 'blog') return;
        
        console.log("Blog: Section navigation detected - previous:", location.previousSection, "current:", location.currentSection);
        
        // When coming from another section to the blog section
        if (location.previousSection !== 'blog' && location.previousSection !== null) {
            console.log("Blog: Coming from a different section - ALWAYS reset to list view");
            
            // IMPORTANT: Force reset to list view when coming from other sections
            setCurrentView('list');
            setSelectedBlogId(null);
            
            // Clean URL
            const url = new URL(window.location);
            if (url.searchParams.has('blogId')) {
                url.searchParams.delete('blogId');
                window.history.replaceState({}, '', url.toString());
            }
            
            // Record navigation time
            setLastNavigationTime(Date.now());
            return;
        }
        
        // First-time loading the blog section (from a direct URL)
        if (location.previousSection === null) {
            // Check if there's a blog ID in the URL for direct links
            const { blogId, isDirectLink } = getBlogIdFromUrl();
            
            if (isDirectLink && blogId) {
                console.log("Blog: Direct blog post link detected:", blogId);
                setSelectedBlogId(blogId);
                setCurrentView('post');
            } else {
                console.log("Blog: First-time loading - showing list view");
                setCurrentView('list');
                setSelectedBlogId(null);
            }
            
            // Record navigation time
            setLastNavigationTime(Date.now());
        }
    }, [location.currentSection, location.previousSection]);
    
    // This useEffect handles URL changes ONLY after we're already in the blog section
    useEffect(() => {
        // Skip if we just navigated to the blog section from elsewhere
        if (Date.now() - lastNavigationTime < 500) {
            console.log("Blog: Skipping URL check immediately after section navigation");
            return;
        }
        
        // Only process URL parameters if we're already in the blog section AND blog items loaded
        if (location.currentSection !== 'blog' || !blogItems.length) return;
        
        // We ONLY handle URL changes when we're already in the blog section
        // This ensures that navigating from elsewhere always shows the list view first
        if (location.previousSection === 'blog') {
            const { blogId, isPostView } = getBlogIdFromUrl();
            
            if (isPostView && blogId) {
                console.log("Blog: URL has blogId and we're already in blog section:", blogId);
                setSelectedBlogId(blogId);
                setCurrentView('post');
            }
        }
    }, [location.currentSection, location.previousSection, blogItems, window.location.search, window.location.hash, lastNavigationTime]);

    // Handle browser back/forward navigation
    useEffect(() => {
        const handlePopState = () => {
            // Only handle popstate when in the blog section
            if (location.currentSection !== 'blog') return;
            
            // Skip if we just navigated to the blog section from elsewhere
            if (Date.now() - lastNavigationTime < 500) {
                console.log("Blog: Skipping popstate handler immediately after section navigation");
                return;
            }
            
            // Get blog ID from URL if present
            const { blogId, isPostView } = getBlogIdFromUrl();
            
            // Only change view based on URL state, and ONLY if already in blog section
            if (isPostView && blogId && location.previousSection === 'blog') {
                console.log("Blog: PopState - Loading blog post:", blogId);
                setSelectedBlogId(blogId);
                setCurrentView('post');
            } else {
                console.log("Blog: PopState - Showing blog list view");
                setCurrentView('list');
                setSelectedBlogId(null);
            }
        };
        
        window.addEventListener('popstate', handlePopState);
        
        // Handle hash changes separately
        const handleHashChange = () => {
            if (location.currentSection === 'blog') {
                const { blogId, isDirectLink } = getBlogIdFromUrl();
                console.log("Blog: Hash changed - checking for blogId:", blogId);
                
                // ONLY change view if this is a direct link AND we're in blog section
                if (isDirectLink && blogId && location.previousSection === 'blog') {
                    setSelectedBlogId(blogId);
                    setCurrentView('post');
                }
            }
        };
        
        window.addEventListener('hashchange', handleHashChange);
        
        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [location.currentSection, location.previousSection, lastNavigationTime]);

    // Navigate to a specific blog post
    const handleBlogSelect = (blogId) => {
        if (!blogId) return;
        
        console.log("Blog: handleBlogSelect called with blogId:", blogId);
        setSelectedBlogId(blogId);
        setCurrentView('post');
        
        // Update URL with the selected blog ID and add the #blog hash
        // This format works better with direct links
        const url = new URL(window.location);
        url.searchParams.set('blogId', blogId);
        
        // Add the #blog hash if it's not already there
        if (!url.hash || url.hash !== '#blog') {
            url.hash = 'blog';
        }
        
        window.history.pushState({ blogId }, '', url.toString());
        
        // Removed localStorage.setItem to prevent auto-redirects on future visits
    };

    // Navigate back to blog list
    const handleBackToList = () => {
        setCurrentView('list');
        setSelectedBlogId(null);
        
        // Remove blogId from URL but keep the #blog hash
        const url = new URL(window.location);
        url.searchParams.delete('blogId');
        
        // Make sure we keep the #blog hash
        if (!url.hash || url.hash !== '#blog') {
            url.hash = 'blog';
        }
        
        window.history.pushState({}, '', url.toString());
        
        console.log("Blog: Back to list view");
    };

    if (currentView === 'post' && selectedBlogId) {
        return (
            <div id={`article-${id}`} className="article blog">
                <BlogPost 
                    blogId={selectedBlogId}
                    onBack={handleBackToList}
                />
            </div>
        );
    }
    
    return (
        <div id={`article-${id}`} className="article blog">
            <BlogList 
                items={blogItems}
                description={dataWrapper.locales?.description}
                onBlogSelect={handleBlogSelect}
            />
        </div>
    );
}

export default Blog;

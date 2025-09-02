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

    // Function to extract blog ID from URL search params
    const getBlogIdFromUrl = () => {
        // For portfolios with section-based navigation, we'll store blog ID in localStorage
        // and search params to maintain compatibility with existing navigation system
        
        // 1. Check URL search parameters
        const searchParams = new URLSearchParams(window.location.search);
        const urlBlogId = searchParams.get('blogId');
        
        // 2. Check URL hash for direct links
        const hash = window.location.hash;
        let hashBlogId = null;
        
        if (hash && hash.includes('blogId=')) {
            const hashParams = new URLSearchParams(hash.includes('?') ? 
                hash.substring(hash.indexOf('?')) : hash);
            hashBlogId = hashParams.get('blogId');
        }
        
        // 3. Return the first valid blog ID found
        const blogId = urlBlogId || hashBlogId;
        
        return {
            blogId,
            isPostView: !!blogId
        };
    }

    // Check URL on mount and when location changes
    useEffect(() => {
        const { blogId, isPostView } = getBlogIdFromUrl();
        console.log("Blog: URL check - blogId:", blogId, "isPostView:", isPostView);
        
        if (isPostView && blogId) {
            setSelectedBlogId(blogId);
            setCurrentView('post');
            // Store for navigation persistence
            localStorage.setItem('current_blog_id', blogId);
        } else {
            setCurrentView('list');
            setSelectedBlogId(null);
            localStorage.removeItem('current_blog_id');
        }
    }, [location.currentSection])

    // Navigate to a specific blog post
    const handleBlogSelect = (blogId) => {
        console.log("Blog: handleBlogSelect called with blogId:", blogId);
        setSelectedBlogId(blogId)
        setCurrentView('post')
        
        // Use search params for compatibility with your portfolio's navigation
        // This approach works better with your existing LocationProvider
        const url = new URL(window.location);
        url.searchParams.set('blogId', blogId);
        
        console.log("Blog: Updating URL to:", url.toString());
        window.history.pushState({ blogId }, '', url.toString());
        
        // Store the blog ID for navigation persistence
        localStorage.setItem('current_blog_id', blogId);
    }

    // Navigate back to blog list
    const handleBackToList = () => {
        setCurrentView('list')
        setSelectedBlogId(null)
        
        // Remove blogId from URL
        const url = new URL(window.location);
        url.searchParams.delete('blogId');
        
        window.history.pushState({}, '', url.toString());
        localStorage.removeItem('current_blog_id');
    }

    // Listen for browser back/forward buttons
    useEffect(() => {
        const handleNavigation = () => {
            const { blogId, isPostView } = getBlogIdFromUrl();
            
            if (isPostView && blogId) {
                setSelectedBlogId(blogId);
                setCurrentView('post');
                localStorage.setItem('current_blog_id', blogId);
            } else {
                setCurrentView('list');
                setSelectedBlogId(null);
                localStorage.removeItem('current_blog_id');
            }
        }

        // Check for direct links or back/forward navigation
        window.addEventListener('popstate', handleNavigation);
        
        // Initial check
        handleNavigation();
        
        return () => {
            window.removeEventListener('popstate', handleNavigation);
        }
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

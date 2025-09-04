import "./BlogList.scss"
import React, { useEffect, useState } from 'react'
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import {useNavigation} from "/src/providers/NavigationProvider.jsx"
import BlogCard from "/src/components/blog/BlogCard.jsx"
import { getBlogIdFromItem } from "/src/hooks/blogDataHelper.js"

function BlogList({ items, description, onBlogSelect }) {
    const language = useLanguage()
    const navigation = useNavigation()
    const [lastViewedBlogId, setLastViewedBlogId] = useState(null)
    const [lastViewedBlogTitle, setLastViewedBlogTitle] = useState('')
    
    // Debug: Log the items when component mounts or updates
    useEffect(() => {
        console.log("BlogList: Received items:", items);
        
        // Check if there's a stored blog ID
        const storedBlogId = localStorage.getItem('current_blog_id');
        if (storedBlogId && items && items.length > 0) {
            // Find the blog item with the stored ID
            const blogItem = items.find(item => {
                const itemBlogId = item.blogData?.id;
                return itemBlogId === storedBlogId;
            });
            
            if (blogItem) {
                setLastViewedBlogId(storedBlogId);
                setLastViewedBlogTitle(blogItem.locales?.title || "Blog post");
            }
        }
    }, [items]);

    if (!items || items.length === 0) {
        return null
    }

    const handleBlogClick = (blogId) => {
        // Call the onBlogSelect prop to handle navigation
        if (!blogId) {
            console.error("Missing blog ID for navigation");
            return;
        }
        console.log("BlogList: Calling onBlogSelect with blogId:", blogId);
        onBlogSelect(blogId);
    }

    const handleCardClick = (item) => {
        console.log("BlogCard clicked:", item);
        
        // Get the blog ID using our helper function
        const blogId = getBlogIdFromItem(item);
        
        if (blogId) {
            handleBlogClick(blogId);
        } else {
            console.error("Could not find blogData.id for item:", item);
        }
    }
    
    // Generate a URL for a blog post using search params
    const getBlogUrl = (blogId) => {
        const url = new URL(window.location);
        url.searchParams.set('blogId', blogId);
        return url.toString();
    }

    const handleClearLastViewed = () => {
        localStorage.removeItem('current_blog_id');
        setLastViewedBlogId(null);
        setLastViewedBlogTitle('');
    }

    return (
        <div className="blog-list">
            <div className="blog-list-header">
                {description && (
                    <p className="blog-list-description">{description}</p>
                )}
                
                {lastViewedBlogId && (
                    <div className="last-viewed-notification">
                        <p>Recently viewed: <strong>"{lastViewedBlogTitle}"</strong></p>
                        <div className="last-viewed-actions">
                            <button 
                                className="continue-reading-btn"
                                onClick={() => onBlogSelect(lastViewedBlogId)}
                            >
                                Go to This Post
                            </button>
                            <button 
                                className="clear-preference-btn"
                                onClick={handleClearLastViewed}
                            >
                                Clear History
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="blog-list-grid">
                {items.map((item) => (
                    <BlogCard
                        key={item.id}
                        item={item}
                        language={language.current}
                        onClick={() => handleCardClick(item)}
                    />
                ))}
            </div>
        </div>
    )
}

export default BlogList

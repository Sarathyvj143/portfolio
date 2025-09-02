import "./BlogList.scss"
import React, { useEffect } from 'react'
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import {useNavigation} from "/src/providers/NavigationProvider.jsx"
import BlogCard from "/src/components/blog/BlogCard.jsx"
import { getBlogIdFromItem } from "/src/hooks/blogDataHelper.js"

function BlogList({ items, description, onBlogSelect }) {
    const language = useLanguage()
    const navigation = useNavigation()

    // Debug: Log the items when component mounts or updates
    useEffect(() => {
        console.log("BlogList: Received items:", items);
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

    return (
        <div className="blog-list">
            <div className="blog-list-header">
                {description && (
                    <p className="blog-list-description">{description}</p>
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

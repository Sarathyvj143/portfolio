import "./BlogPost.scss"
import React, { useState, useEffect } from 'react'
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import {useNavigation} from "/src/providers/NavigationProvider.jsx"
import {useData} from "/src/providers/DataProvider.jsx"
import {useViewport} from "/src/providers/ViewportProvider.jsx"
import {useLocation} from "/src/providers/LocationProvider.jsx"
import TableOfContents from "/src/components/blogpost/TableOfContents.jsx"
import Layout from "/src/components/layout/Layout.jsx"
import NavHeaderMain from "/src/components/nav/partials/NavHeaderMain.jsx"
import { getAssetUrl, isGitHubPages } from "/src/hooks/assetHelper.js"
import {useUtils} from "/src/hooks/utils.js"

function BlogPost({ blogId, onBack }) {
    const language = useLanguage()
    const navigation = useNavigation()
    const location = useLocation()
    const data = useData()
    const viewport = useViewport()
    const utils = useUtils()
    const [blogPost, setBlogPost] = useState(null)
    const [loading, setLoading] = useState(true)
    
    // Effect to collapse sidebar when entering blog post
    useEffect(() => {
        // Dispatch event to collapse sidebar when blog post mounts
        window.dispatchEvent(new CustomEvent('sidebar-state-change', { 
            detail: { expanded: false }
        }))
        
        // When component unmounts, we don't restore the state
        // This will be handled by SidebarStateProvider based on the next section
    }, [])

    useEffect(() => {
        console.log("BlogPost: useEffect triggered with blogId:", blogId);
        if (blogId) {
            loadBlogPost(blogId)
        } else {
            console.log("BlogPost: No blogId provided");
        }
    }, [blogId])

    const loadBlogPost = async (id) => {
        try {
            setLoading(true)
            console.log("BlogPost: Loading blog post with ID:", id);
            
            // Create the URL for the blog post JSON file using our asset helper
            const blogPostUrl = getAssetUrl(`/data/blog-posts/${id}.json`);
            
            console.log("BlogPost: Attempting to fetch from URL:", blogPostUrl);
            const response = await fetch(blogPostUrl, {
                // Add cache control headers to prevent caching issues
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            
            console.log("BlogPost: Fetch response status:", response.status);
            
            if (response.ok) {
                const blogData = await response.json()
                console.log("BlogPost: Successfully loaded blog data:", blogData);
                setBlogPost(blogData)
            } else {
                console.error('Failed to load blog post:', id)
                // Try a fallback approach for GitHub Pages if needed
                if (isGitHubPages()) {
                    tryFallbackLoad(id);
                }
            }
        } catch (error) {
            console.error('Error loading blog post:', error)
            // Try a fallback approach for GitHub Pages if needed
            if (isGitHubPages()) {
                tryFallbackLoad(id);
            }
        } finally {
            setLoading(false)
        }
    }
    
    // Fallback loader for GitHub Pages
    const tryFallbackLoad = async (id) => {
        try {
            console.log("BlogPost: Trying fallback load approach for GitHub Pages");
            
            // Try different path variations
            const variations = [
                `/react-portfolio-template/data/blog-posts/${id}.json`,
                `./data/blog-posts/${id}.json`,
                `../data/blog-posts/${id}.json`
            ];
            
            // Try each variation
            for (const path of variations) {
                try {
                    console.log(`BlogPost: Trying fallback path: ${path}`);
                    const response = await fetch(path);
                    
                    if (response.ok) {
                        const blogData = await response.json();
                        console.log("BlogPost: Fallback successful with path:", path);
                        setBlogPost(blogData);
                        return; // Exit if successful
                    }
                } catch (e) {
                    console.log(`Fallback path ${path} failed:`, e);
                    // Continue to the next variation
                }
            }
            
            console.error("All fallback approaches failed");
        } catch (error) {
            console.error("Fallback loading failed:", error);
        }
    };

    const handleBackToBlog = () => {
        if (onBack) {
            onBack(); // Use the provided callback if available
        } else {
            navigation.navigateToSection("blog"); // Fallback to navigation provider
        }
    }
    
    // Function to toggle the main sidebar
    const toggleMainSidebar = () => {
        // Get current state from DOM since we don't have direct access to NavSidebar's state
        const sidebar = document.querySelector('.nav-sidebar')
        const isCurrentlyCollapsed = sidebar?.classList.contains('nav-sidebar-shrink')
        
        // Dispatch event to toggle sidebar
        window.dispatchEvent(new CustomEvent('sidebar-state-change', { 
            detail: { expanded: isCurrentlyCollapsed }
        }))
    }

    if (loading) {
        return (
            <div className="blog-post-container">
                {/* <header className="blog-post-header-nav">
                    <NavHeaderMain activeHref="#blog" />
                </header> */}
                <div className="blog-post-wrapper">
                    <div className="blog-post-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading blog post...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!blogPost) {
        return (
            <div className="blog-post-container">
                {/* <header className="blog-post-header-nav">
                    <NavHeaderMain activeHref="#blog" />
                </header> */}
                <div className="blog-post-wrapper">
                    <div className="blog-post-error">
                        <h2>Blog Post Not Found</h2>
                        <p>The requested blog post could not be found.</p>
                        <button onClick={handleBackToBlog} className="back-button">
                            Back to Blog
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const title = blogPost.title?.[language.current] || blogPost.title?.en || "Untitled"
    const description = blogPost.description?.[language.current] || blogPost.description?.en || ""
    const image = blogPost.image
    const date = blogPost.date
    const readTime = blogPost.readTime
    const author = blogPost.author
    const tags = blogPost.tags || []
    const content = blogPost.content?.[language.current] || blogPost.content?.en

    const formatDate = (dateString) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date.toLocaleDateString(language.current || 'en', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="blog-post-container">
            {/* Header Navbar */}
            {/* <header className="blog-post-header-nav">
                <NavHeaderMain activeHref="#blog" />
            </header> */}
            
            {/* Main Content Area */}
            <div className="blog-post-wrapper">
                {/* Table of Contents Sidebar (20%) */}
                <aside className="blog-post-toc">
                    <div className="blog-post-toc-inner">
                        <div className="blog-post-action-buttons">
                            <button onClick={handleBackToBlog} className="back-button">
                                ← Back to Blog
                            </button>
                            
                            <button 
                                onClick={() => utils.file.download(getAssetUrl("/documents/Partha_Sarathy_R_Software_Developer.pdf"))} 
                                className="resume-button"
                            >
                                <i className="fa-solid fa-file-arrow-down"></i> Resume
                            </button>
                            
                            <button 
                                onClick={toggleMainSidebar} 
                                className="toggle-sidebar-button"
                                title="Toggle main navigation"
                            >
                                <i className="fa-solid fa-bars"></i> Toggle Navigation
                            </button>
                        </div>
                        
                        <TableOfContents 
                            sections={content?.sections || []}
                            title="Table of Contents"
                        />
                    </div>
                </aside>
                
                {/* Main Content (80%) */}
                <main className="blog-post">
                    <div className="blog-post-header">
                        <div className="blog-post-meta">
                            {date && (
                                <span className="blog-post-date">{formatDate(date)}</span>
                            )}
                            {readTime && (
                                <span className="blog-post-read-time">{readTime}</span>
                            )}
                            {author && (
                                <span className="blog-post-author">By {author}</span>
                            )}
                        </div>
                        
                        <h1 className="blog-post-title">{title}</h1>
                        {description && (
                            <p className="blog-post-description">{description}</p>
                        )}
                        
                        {image && (
                            <div className="blog-post-image-container">
                                <img 
                                    src={image.startsWith('http') ? image : getAssetUrl(image)} 
                                    alt={title}
                                    className="blog-post-image"
                                />
                            </div>
                        )}
                        
                        {tags.length > 0 && (
                            <div className="blog-post-tags">
                                {tags.map((tag, index) => (
                                    <span key={index} className="blog-post-tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="blog-post-content">
                        {content && content.sections && content.sections.map((section, index) => (
                            <section key={section.id || index} id={section.id} className="blog-post-section">
                                <h2 className="blog-post-section-title">{section.title}</h2>
                                <div className="blog-post-section-content">
                                    {section.content}
                                </div>
                            </section>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default BlogPost

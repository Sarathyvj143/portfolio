import "./BlogCard.scss"
import React, { useEffect } from 'react'
import { getAssetUrl } from "/src/hooks/assetHelper.js"

function BlogCard({ item, language, onClick }) {
    // Debug: Log the blog item when it mounts
    useEffect(() => {
        console.log("BlogCard received item:", item);
        if (item.blogData) {
            console.log("BlogCard has blogData:", item.blogData);
        }
    }, [item]);

    const title = item.locales?.title || "Untitled"
    const description = item.locales?.text || ""
    const image = item.img
    const date = item.blogData?.date
    const readTime = item.blogData?.readTime
    const tags = item.blogData?.tags || []

    const formatDate = (dateString) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date.toLocaleDateString(language || 'en', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const handleImageError = (e) => {
        // Replace broken image with a placeholder
        e.target.style.display = 'none'
        const placeholder = e.target.parentNode.querySelector('.blog-card-placeholder')
        if (placeholder) {
            placeholder.style.display = 'flex'
        }
    }

    const handleClick = (e) => {
        console.log("BlogCard clicked, item:", item);
        
        if (onClick) {
            // If it's an anchor tag click, let the default behavior work
            if (e && e.target && e.target.tagName === 'A') {
                return;
            }
            
            // Otherwise use the custom handler
            onClick();
        }
    }

    return (
        <div className="blog-card" onClick={handleClick}>
            <div className="blog-card-image-container">
                {image ? (
                    <img 
                        src={image.startsWith('http') ? image : getAssetUrl(image)} 
                        alt={title}
                        className="blog-card-image"
                        loading="lazy"
                        onError={handleImageError}
                    />
                ) : null}
                <div className="blog-card-placeholder" style={{ display: image ? 'none' : 'flex' }}>
                    {item.faIcon ? (
                        <i className={item.faIcon} style={{
                            backgroundColor: item.faIconColors?.bg || '#f0f0f0',
                            color: item.faIconColors?.fill || '#333',
                            fontSize: '2rem',
                            padding: '1rem',
                            borderRadius: '50%'
                        }}></i>
                    ) : (
                        <div className="placeholder-icon">📝</div>
                    )}
                </div>
                <div className="blog-card-overlay">
                    <div className="blog-card-read-more">
                        Read More
                    </div>
                </div>
            </div>
            
            <div className="blog-card-content">
                <div className="blog-card-meta">
                    {date && (
                        <span className="blog-card-date">{formatDate(date)}</span>
                    )}
                    {readTime && (
                        <span className="blog-card-read-time">{readTime}</span>
                    )}
                </div>
                
                <h3 className="blog-card-title">{title}</h3>
                <p className="blog-card-description">{description}</p>
                
                {tags.length > 0 && (
                    <div className="blog-card-tags">
                        {tags.map((tag, index) => (
                            <span key={index} className="blog-card-tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default BlogCard

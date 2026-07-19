import "./BlogPost.scss"
import React, { useState, useEffect, useMemo } from 'react'
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import {useNavigation} from "/src/providers/NavigationProvider.jsx"
import {useData} from "/src/providers/DataProvider.jsx"
import {useViewport} from "/src/providers/ViewportProvider.jsx"
import {useLocation} from "/src/providers/LocationProvider.jsx"
import TableOfContents from "/src/components/blogpost/TableOfContents.jsx"
import { getAssetUrl, getBaseUrl } from "/src/hooks/assetHelper.js"
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
    const [showMobileToc, setShowMobileToc] = useState(false)

    const isMobile = viewport.isMobileLayout()

    // Collapse the main sidebar when entering a blog post.
    // The next section's state is restored by SidebarStateProvider.
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('sidebar-state-change', {
            detail: { expanded: false }
        }))
    }, [])

    useEffect(() => {
        if (blogId) {
            loadBlogPost(blogId)
        }
    }, [blogId])

    const loadBlogPost = async (id) => {
        try {
            setLoading(true)

            // assetHelper normalizes the path for both local dev and GitHub Pages.
            const blogPostUrl = getAssetUrl(`/data/blog-posts/${id}.json`)
            const response = await fetch(blogPostUrl)

            if (response.ok) {
                const blogData = await response.json()
                setBlogPost(blogData)
            } else {
                console.error('Failed to load blog post:', id)
                setBlogPost(null)
            }
        } catch (error) {
            console.error('Error loading blog post:', error)
            setBlogPost(null)
        } finally {
            setLoading(false)
        }
    }

    const handleBackToBlog = () => {
        if (onBack) {
            onBack() // Use the provided callback if available
        } else {
            navigation.navigateToSection("blog") // Fallback to navigation provider
        }
    }

    // Derive display values (guarded so the hooks below run before early returns).
    const title = blogPost?.title?.[language.current] || blogPost?.title?.en || "Untitled"
    const description = blogPost?.description?.[language.current] || blogPost?.description?.en || ""
    const image = blogPost?.image
    const date = blogPost?.date
    const readTime = blogPost?.readTime
    const author = blogPost?.author
    const tags = blogPost?.tags || []
    const content = blogPost?.content?.[language.current] || blogPost?.content?.en

    // Pre-process section HTML once per post: normalize image paths and make
    // in-content images lazy. Runs off render to avoid re-parsing every render.
    const processedSections = useMemo(() => {
        const sections = content?.sections || []
        const baseUrl = getBaseUrl()

        return sections.map((section) => {
            let html = section.content || ''

            if (html) {
                const tempDiv = document.createElement('div')
                tempDiv.innerHTML = html
                tempDiv.querySelectorAll('img').forEach((img) => {
                    const src = img.getAttribute('src')
                    if (src && src.startsWith('/')) {
                        img.setAttribute('src', `${baseUrl}${src}`)
                    }
                    img.setAttribute('loading', 'lazy')
                    img.setAttribute('decoding', 'async')
                })
                html = tempDiv.innerHTML
            }

            return { id: section.id, title: section.title, html }
        })
    }, [content])

    // SEO: manage document head (title, meta, Open Graph, JSON-LD) for the active post.
    // Every element/attribute we touch is restored on cleanup so leaving the post
    // (or switching posts) never leaves stale metadata behind.
    useEffect(() => {
        if (!blogPost) return

        const absoluteImage = image
            ? (image.startsWith('http') ? image : `${window.location.origin}${getAssetUrl(image)}`)
            : ""
        const pageUrl = window.location.href

        // Track everything we change so we can revert it exactly.
        const restorers = []

        const prevTitle = document.title
        document.title = `${title} | Blog`
        restorers.push(() => { document.title = prevTitle })

        const upsertMeta = (attr, key, metaContent) => {
            if (!metaContent) return
            const selector = `meta[${attr}="${key}"]`
            let el = document.head.querySelector(selector)
            if (el) {
                const prev = el.getAttribute('content')
                el.setAttribute('content', metaContent)
                restorers.push(() => { el.setAttribute('content', prev) })
            } else {
                el = document.createElement('meta')
                el.setAttribute(attr, key)
                el.setAttribute('content', metaContent)
                document.head.appendChild(el)
                restorers.push(() => { el.remove() })
            }
        }

        upsertMeta('name', 'description', description)
        upsertMeta('property', 'og:type', 'article')
        upsertMeta('property', 'og:title', title)
        upsertMeta('property', 'og:description', description)
        upsertMeta('property', 'og:url', pageUrl)
        upsertMeta('property', 'og:image', absoluteImage)
        upsertMeta('name', 'twitter:card', absoluteImage ? 'summary_large_image' : 'summary')
        upsertMeta('name', 'twitter:title', title)
        upsertMeta('name', 'twitter:description', description)
        upsertMeta('name', 'twitter:image', absoluteImage)

        // BlogPosting structured data for rich results.
        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": description,
            "datePublished": date,
            "dateModified": date,
            "author": { "@type": "Person", "name": author || "Partha Sarathy R" },
            "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl }
        }
        if (absoluteImage) jsonLd.image = absoluteImage
        if (tags.length > 0) jsonLd.keywords = tags.join(", ")

        const ldScript = document.createElement('script')
        ldScript.type = 'application/ld+json'
        ldScript.text = JSON.stringify(jsonLd)
        document.head.appendChild(ldScript)
        restorers.push(() => { ldScript.remove() })

        return () => {
            // Revert in reverse order.
            for (let i = restorers.length - 1; i >= 0; i--) restorers[i]()
        }
        // title/description/image/date/author/tags are all pure derivations of
        // blogPost + language.current, so these two deps fully cover them —
        // and avoid re-running on the fresh `tags` array minted each render.
    }, [blogPost, language.current])

    if (loading) {
        return (
            <div className="blog-post-container">
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

    return (
        <div className="blog-post-container">
            {/* Mobile Header Bar with Back button */}
            {isMobile && (
                <div className="blog-post-mobile-header">
                    <button onClick={handleBackToBlog} className="blog-post-mobile-back">
                        <i className="fa-solid fa-arrow-left"></i> Back to Blog
                    </button>
                </div>
            )}

            {/* Main Content Area */}
            <div className="blog-post-wrapper">
                {/* Table of Contents Sidebar - desktop only */}
                {!isMobile && (
                    <aside className="blog-post-toc">
                        <div className="blog-post-toc-inner">
                            <div className="blog-post-action-buttons">
                                <button onClick={handleBackToBlog} className="back-button">
                                    ← Back to Blog
                                </button>
                            </div>

                            <TableOfContents
                                sections={content?.sections || []}
                                title="Table of Contents"
                            />
                        </div>
                    </aside>
                )}

                {/* Main Content */}
                <main className="blog-post">
                    <div className="blog-post-header">
                        <div className="blog-post-meta">
                            {date && (
                                <span className="blog-post-date">{utils.date.formatLocalized(date, language.current)}</span>
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

                        {tags.length > 0 && (
                            <div className="blog-post-tags">
                                {tags.map((tag) => (
                                    <span key={tag} className="blog-post-tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="blog-post-content">
                        {processedSections.map((section, index) => (
                            <section key={section.id || index} id={section.id} className="blog-post-section">
                                <h2 className="blog-post-section-title">{section.title}</h2>
                                <div
                                    className="blog-post-section-content"
                                    dangerouslySetInnerHTML={{ __html: section.html }}
                                ></div>
                            </section>
                        ))}
                    </div>
                </main>

                {/* Mobile TOC Button - React-based modal */}
                {isMobile && (
                    <button
                        className="blog-post-mobile-toc"
                        onClick={() => setShowMobileToc(true)}
                        aria-label="Open table of contents"
                    >
                        <i className="fa-solid fa-list"></i>
                    </button>
                )}
            </div>

            {/* Mobile TOC Modal */}
            {isMobile && showMobileToc && (
                <div className="blog-post-mobile-toc-modal" onClick={() => setShowMobileToc(false)}>
                    <div className="blog-post-mobile-toc-content" onClick={(e) => e.stopPropagation()}>
                        <div className="blog-post-mobile-toc-header">
                            <h3>Table of Contents</h3>
                            <button
                                className="blog-post-mobile-toc-close"
                                onClick={() => setShowMobileToc(false)}
                                aria-label="Close table of contents"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div onClick={() => setShowMobileToc(false)}>
                            <TableOfContents
                                sections={content?.sections || []}
                                title=""
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BlogPost

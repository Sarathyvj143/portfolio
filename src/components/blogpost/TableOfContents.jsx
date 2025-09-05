import "./TableOfContents.scss"
import React, { useState, useEffect } from 'react'
import {useLanguage} from "/src/providers/LanguageProvider.jsx"

function TableOfContents({ sections, title }) {
    const language = useLanguage()
    const [activeSection, setActiveSection] = useState('')
    const [isSticky, setIsSticky] = useState(false)
    const [expandedItems, setExpandedItems] = useState({})

    useEffect(() => {
        const handleScroll = () => {
            // Check if sidebar should be sticky
            const sidebar = document.querySelector('.blog-post-sidebar')
            if (sidebar) {
                const rect = sidebar.getBoundingClientRect()
                setIsSticky(rect.top <= 20)
            }

            // Find active section based on scroll position
            const sectionElements = sections.map(section => ({
                id: section.id,
                element: document.getElementById(section.id)
            })).filter(item => item.element)

            let currentActive = ''
            for (let i = sectionElements.length - 1; i >= 0; i--) {
                const rect = sectionElements[i].element.getBoundingClientRect()
                if (rect.top <= 100) {
                    currentActive = sectionElements[i].id
                    break
                }
            }

            setActiveSection(currentActive)
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll() // Initial check

        return () => window.removeEventListener('scroll', handleScroll)
    }, [sections])

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            })
        }
    }
    
    const toggleExpand = (sectionId) => {
        setExpandedItems(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }))
    }
    
    // Generate a short preview from section content
    const generatePreview = (content) => {
        if (!content) return '';
        
        // If content is HTML/JSX, convert to plain text first
        let plainText = '';
        if (typeof content === 'string') {
            // Try to extract text from HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            plainText = tempDiv.textContent || tempDiv.innerText || '';
        } else {
            // If it's a React element, we can't easily get a preview
            return '';
        }
        
        // Get first 50 characters
        return plainText.substring(0, 50) + (plainText.length > 50 ? '...' : '');
    }

    if (!sections || sections.length === 0) {
        return null
    }

    const tocTitle = title?.[language.current] || title?.en || "Table of Contents"

    return (
        <div className={`table-of-contents ${isSticky ? 'sticky' : ''}`}>
            <h3 className="toc-title">{tocTitle}</h3>
            <nav className="toc-nav">
                <ul className="toc-list">
                    {sections.map((section, index) => {
                        const isExpanded = expandedItems[section.id];
                        const previewText = generatePreview(section.content);
                        
                        return (
                            <li key={section.id || index} className="toc-item">
                                <div className="toc-item-container">
                                    <button
                                        className={`toc-link ${activeSection === section.id ? 'active' : ''}`}
                                        onClick={() => scrollToSection(section.id)}
                                    >
                                        {section.title}
                                    </button>
                                    
                                    {previewText && (
                                        <button 
                                            className="toc-expand-button" 
                                            onClick={() => toggleExpand(section.id)}
                                            aria-label={isExpanded ? "Collapse section preview" : "Expand section preview"}
                                        >
                                            <i className={`fa-solid ${isExpanded ? 'fa-minus' : 'fa-plus'}`}></i>
                                        </button>
                                    )}
                                </div>
                                
                                {isExpanded && previewText && (
                                    <div className="toc-preview">
                                        {previewText}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    )
}

export default TableOfContents

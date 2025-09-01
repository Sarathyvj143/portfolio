import "./TableOfContents.scss"
import React, { useState, useEffect } from 'react'
import {useLanguage} from "/src/providers/LanguageProvider.jsx"

function TableOfContents({ sections, title }) {
    const language = useLanguage()
    const [activeSection, setActiveSection] = useState('')
    const [isSticky, setIsSticky] = useState(false)

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

    if (!sections || sections.length === 0) {
        return null
    }

    const tocTitle = title?.[language.current] || title?.en || "Table of Contents"

    return (
        <div className={`table-of-contents ${isSticky ? 'sticky' : ''}`}>
            <h3 className="toc-title">{tocTitle}</h3>
            <nav className="toc-nav">
                <ul className="toc-list">
                    {sections.map((section, index) => (
                        <li key={section.id || index} className="toc-item">
                            <button
                                className={`toc-link ${activeSection === section.id ? 'active' : ''}`}
                                onClick={() => scrollToSection(section.id)}
                            >
                                {section.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}

export default TableOfContents

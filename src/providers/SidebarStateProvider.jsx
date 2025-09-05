/**
 * @author Parthasarathy
 * @date 2025-09-05
 * @description This provider manages the sidebar expanded/collapsed state for different sections
 */

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigation } from '/src/providers/NavigationProvider.jsx'
import { useLocation } from '/src/providers/LocationProvider.jsx'

function SidebarStateProvider({ children }) {
    // Default states for different sections
    const [sectionSidebarStates, setSectionSidebarStates] = useState(() => {
        // Try to get stored states from localStorage
        const savedStates = localStorage.getItem('section-sidebar-states')
        return savedStates ? JSON.parse(savedStates) : {
            // Default state for each section: true = expanded, false = collapsed
            blog: false, // Blog section starts collapsed
            default: true // All other sections start expanded
        }
    })
    
    // Current sidebar state based on active section
    const [sidebarExpanded, setSidebarExpanded] = useState(true)
    const navigation = useNavigation()
    const location = useLocation()
    
    // Update sidebar state when section changes
    useEffect(() => {
        const currentSection = location.currentSection
        if (currentSection) {
            const newState = sectionSidebarStates[currentSection] !== undefined 
                ? sectionSidebarStates[currentSection] 
                : sectionSidebarStates.default
            
            setSidebarExpanded(newState)
            
            // Dispatch a custom event for NavSidebar to listen to
            window.dispatchEvent(new CustomEvent('sidebar-state-change', { 
                detail: { expanded: newState }
            }))
        }
    }, [location.currentSection, sectionSidebarStates])
    
    // Function to toggle sidebar state for current section
    const toggleSidebarForCurrentSection = () => {
        const currentSection = location.currentSection
        if (!currentSection) return
        
        const newSectionStates = {...sectionSidebarStates}
        newSectionStates[currentSection] = !sidebarExpanded
        
        // Save to state and localStorage
        setSectionSidebarStates(newSectionStates)
        localStorage.setItem('section-sidebar-states', JSON.stringify(newSectionStates))
        
        // Update current state
        setSidebarExpanded(!sidebarExpanded)
        
        // Dispatch event for NavSidebar
        window.dispatchEvent(new CustomEvent('sidebar-state-change', { 
            detail: { expanded: !sidebarExpanded }
        }))
    }
    
    // Function to set sidebar state for a specific section
    const setSidebarStateForSection = (section, expanded) => {
        if (!section) return
        
        const newSectionStates = {...sectionSidebarStates}
        newSectionStates[section] = expanded
        
        // Save to state and localStorage
        setSectionSidebarStates(newSectionStates)
        localStorage.setItem('section-sidebar-states', JSON.stringify(newSectionStates))
        
        // If this is the current section, update current state too
        if (section === location.currentSection) {
            setSidebarExpanded(expanded)
            
            // Dispatch event for NavSidebar
            window.dispatchEvent(new CustomEvent('sidebar-state-change', { 
                detail: { expanded }
            }))
        }
    }
    
    return (
        <SidebarStateContext.Provider value={{
            sidebarExpanded,
            toggleSidebarForCurrentSection,
            setSidebarStateForSection
        }}>
            {children}
        </SidebarStateContext.Provider>
    )
}

const SidebarStateContext = createContext(null)

/**
 * @return {{
 *    sidebarExpanded: Boolean,
 *    toggleSidebarForCurrentSection: Function,
 *    setSidebarStateForSection: Function
 * }}
 */
export const useSidebarState = () => useContext(SidebarStateContext)

export default SidebarStateProvider

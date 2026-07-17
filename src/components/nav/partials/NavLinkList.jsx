import "./NavLinkList.scss"
import React from 'react'
import Nav from "/src/components/nav/base/Nav.jsx"
import GestureAwareButton from "/src/components/buttons/GestureAwareButton.jsx"

function NavLinkList({ links, expanded }) {
    const data = {expanded}
    const shrinkClass = expanded ?
        `` :
        `nav-link-list-shrink`

    return (
        <Nav links={links}
             data={data}
             tag={`nav-link-list`}
             className={`nav-link-list ${shrinkClass}`}
             itemComponent={NavLink}/>
    )
}

function NavLink({ link, active, data, onClick }) {
    const activeClass = active ?
        `nav-link-active` :
        ``
    const tooltip = data.expanded ?
        null :
        link.label

    // Plain-text name for assistive tech — the visible label may be hidden
    // (collapsed mode) or contain markup, and the icon is decorative.
    const accessibleLabel = (link.label || "").replace(/<[^>]*>/g, "")

    return (
        <GestureAwareButton className={`nav-link ${activeClass}`}
                            hrefToolTip={link.href}
                            tooltip={tooltip}
                            ariaLabel={accessibleLabel}
                            ariaCurrent={active ? "page" : null}
                            onClick={onClick}>
            <i className={`${link.faIcon}`} aria-hidden={`true`}/>
            <span dangerouslySetInnerHTML={{__html: link.label}}/>
        </GestureAwareButton>
    )
}

export default NavLinkList

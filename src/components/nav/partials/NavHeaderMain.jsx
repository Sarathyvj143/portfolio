import React, { useState, useEffect } from "react";
import "./NavHeaderMain.scss";
import { useData } from "/src/providers/DataProvider.jsx";
import { useUtils } from "/src/hooks/utils.js";

const NavHeaderMain = ({ activeHref }) => {
  const [sectionLinks, setSectionLinks] = useState([]);
  const data = useData();
  const utils = useUtils();
  
  useEffect(() => {
    if (data) {
      const sections = data.getSections();
      const links = sections.map(section => ({
        label: section.id.charAt(0).toUpperCase() + section.id.slice(1),
        href: `#${section.id}`,
        icon: section.faIcon
      }));
      setSectionLinks(links);
    }
  }, [data]);
  
  return (
  <nav className="nav-header-main">
    <ul className="nav-header-main__list">
      {sectionLinks.map(link => (
        <li
          key={link.href}
          className={
            "nav-header-main__item" +
            (activeHref === link.href ? " nav-header-main__item--active" : "")
          }
        >
          <a href={link.href} className="nav-header-main__link">
            {link.icon && <i className={link.icon} style={{marginRight: 8}}></i>}
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
  );
};

export default NavHeaderMain;

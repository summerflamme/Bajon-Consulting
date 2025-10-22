import type { Section } from "@/types/audit";
import "./AuditStyle.css";
import { useState } from 'react';
import { Menu } from "lucide-react";

function SideBarNav({ data, currentIndex, goToSection }: { data: Section[]; currentIndex: number; goToSection: (index: number) => void }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={`sidebar-nav ${collapsed ? 'collapsed' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="sections-title">Sections</h3>
                <Menu
                    onClick={() => setCollapsed((c) => !c)}
                >
                </Menu>
            </div>
            <ul className="sections-list">
                {data.map((section, index) => (
                    <li key={section.id}>
                        <button
                            onClick={() => goToSection(index)}
                            className={`section-button ${index === currentIndex ? "active" : ""}`}
                        >
                            {section.title}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SideBarNav;
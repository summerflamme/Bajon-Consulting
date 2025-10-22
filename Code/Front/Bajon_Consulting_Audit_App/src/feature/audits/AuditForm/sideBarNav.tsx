import type { Section } from "@/types/audit";
import "./AuditStyle.css";
import { useState } from 'react';
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

function SideBarNav({ data, currentIndex, goToSection }: { data: Section[]; currentIndex: number; goToSection: (index: number) => void }) {
    const [collapsed, setCollapsed] = useState(false);

    return (


        <motion.div className={`sidebar-nav ${collapsed ? 'collapsed' : ''}`}
                initial={{ width: collapsed ? 56 : 220 }}
            animate={{ width: collapsed ? 56 : 220 }}
            exit={{ width: collapsed ? 56 : 220 }}
            transition={{ duration: 0.3 }}
        >
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
        </motion.div>
    );
}

export default SideBarNav;
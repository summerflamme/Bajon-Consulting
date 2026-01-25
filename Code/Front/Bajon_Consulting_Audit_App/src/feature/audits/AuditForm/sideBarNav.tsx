import type { Section } from "@/types/audit";
import "./AuditStyle.css";
import { useState } from 'react';
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { MenuIcon } from "@/components/ui/menu";

function SideBarNav({ data, currentIndex, goToSection }: { data: Section[]; currentIndex: number; goToSection: (index: number) => void }) {
    const [collapsed, setCollapsed] = useState(true);

    return (


        <motion.div layout className={`sidebar-nav ${collapsed ? 'collapsed' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* ecran reduit */}
                {window.innerWidth < 768 ? (
                    <ChevronDown
                        onClick={() => setCollapsed((c) => !c)}
                        className={`chev ${collapsed ? 'chev-rotated' : ''}`}
                        aria-hidden={false}
                    />
                ) : (
                    <MenuIcon open={collapsed} onClick={() => setCollapsed((c) => !c)} />
                )}
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
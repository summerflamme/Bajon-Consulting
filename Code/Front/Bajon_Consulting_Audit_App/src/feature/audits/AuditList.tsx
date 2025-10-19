import AuditCard from "../feature/audits/AuditCard";
import './components.css';

const audits = [1, 2, 3, 4, 5]; // Remplace par tes données réelles

function AuditList() {
    return (
        <div className="audit-list">    
            <div className="audit-grid">
                {audits.map((_audit, idx) => (
                    <AuditCard key={idx} />
                ))}
            </div>
        </div>
    );
}

export default AuditList;

import AuditCard from '../../components/AuditCard';
import SearchBar from '../../components/SearchBar';
import './AuditListPage.css';

const audits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]; // Remplace par tes données réelles

function AuditList() {
    return (
        <><SearchBar /><div className="audit-list">
            <div className="audit-grid">
                {audits.map((_audit, idx) => (
                    <AuditCard key={idx} />
                ))}
            </div>
        </div></>
    );
}

export default AuditList;
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import AuditCard from '../../components/AuditCard';
import SearchBar from '../../components/SearchBar';
import './AuditListPage.css';

function AuditList() {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchAudits = async () => {
    const { data, error } = await supabase
      .from("audit")
      .select("*")

    if (error) {
      console.error("Erreur de récupération :", error);
    } else {
      setAudits(data || []);
    }
    setLoading(false);
  };

  fetchAudits();
  }, []);

  if (loading) return <p>Chargement ...</p>;

  return (
    <>
      <SearchBar /><div className="audit-list">
          <div className="audit-grid">
              {audits.map(audit => (
                  <AuditCard key={audit.idaudit} audit={audit} />
              ))}
          </div>
      </div>
    </>
  );
}

export default AuditList;
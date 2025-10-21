import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../supabaseClient';
import AuditCard from '../AuditCard/AuditCard';
import SearchBar from '../../../components/SearchBar';
import './AuditListPage.css';
import { Plus } from "lucide-react";

function AuditList() {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // États pour filtres et tri
  const [searchTerm, setSearchTerm] = useState('');
  const [auditType, setAuditType] = useState('');
  const [offerType, setOfferType] = useState('');
  const [sortField, setSortField] = useState('alphabetique');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Récupération des audits depuis Supabase avec filtres et tri
  const fetchAudits = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from(`audit`)
      .select(`*, audittype ( id, nameaudittype ), auditoffer ( id, nameauditoffer )`)
      .eq('template', false);

    // Recherche textuelle
    if (searchTerm.trim() !== '') {
      query = query.ilike('auditname', `%${searchTerm}%`);
    }

    // Filtre par type d’audit
    if (auditType) {
      query = query.eq('idaudittype', auditType);
    }

    // Filtre par type d’offre
    if (offerType) {
      query = query.eq('idauditoffer', offerType);
    }

    // Tri
    if (sortField === 'alphabetique') {
      query = query.order('auditname', { ascending: sortOrder === 'asc' });
    } else if (sortField === 'date') {
      query = query.order('datecreation', { ascending: sortOrder === 'asc' });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erreur Supabase :', error);
    } else {
      setAudits(data || []);
    }
    setLoading(false);
  }, [searchTerm, auditType, offerType, sortField, sortOrder]);

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]);

  return (
    <>
    <div className="audit-list-page">
      <SearchBar
        onSearchChange={(value) => setSearchTerm(value)}
        onAuditTypeChange={(value) => setAuditType(value)}
        onOfferTypeChange={(value) => setOfferType(value)}
        onSortChange={(value) => setSortField(value)}
        onSortOrderChange={(order) => setSortOrder(order)}
      />  
      <a href='/newaudit' className="add-audit-btn">
        <Plus className="icon" /> Ajouter un nouvel audit
      </a>
      <div className="audit-list">
        {loading ? (
          <>
            <br/><br/><br/><br/><br/><br/><br/><br/>
            <p>Chargement...</p>
          </>
        ) : (
          <div className="audit-grid">
            {audits.length > 0 ? (
              audits.map((audit) => <AuditCard key={audit.idaudit} audit={audit} />)
            ) : (
              <p>Aucun audit trouvé.</p>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default AuditList;

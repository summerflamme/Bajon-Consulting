import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../supabaseClient';
import AuditCard from '../../audits/AuditCard/AuditCard';
import SearchBar from '../../../components/SearchBar';
import './TemplateListPage.css';
import { Plus } from 'lucide-react';

function TemplateList() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // États pour filtres et tri
  const [searchTerm, setSearchTerm] = useState('');
  const [auditType, setAuditType] = useState('');
  const [offerType, setOfferType] = useState('');
  const [sortField, setSortField] = useState('alphabetique');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Récupération des audits depuis Supabase avec filtres et tri
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from(`audit`)
      .select(`*, audittype ( id, nameaudittype ), auditoffer ( id, nameauditoffer )`)
      .eq('template', true);

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
      setTemplates(data || []);
    }
    setLoading(false);
  }, [searchTerm, auditType, offerType, sortField, sortOrder]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return (
    <>
    <div className="template-list-page">
      <SearchBar variant='audit'
        onSearchChange={(value) => setSearchTerm(value)}
        onAuditTypeChange={(value) => setAuditType(value)}
        onOfferTypeChange={(value) => setOfferType(value)}
        onSortChange={(value) => setSortField(value)}
        onSortOrderChange={(order) => setSortOrder(order)}
      />
      <a href='#' className="add-template-btn">
        <Plus className="icon" /> Ajouter un nouveau template
      </a>
      <div className="template-list">
        {loading ? (
          <>
            <br/><br/><br/><br/><br/><br/><br/><br/>
            <p>Chargement...</p>
          </>
        ) : (
          <div className="template-grid">
            {templates.length > 0 ? (
              templates.map((template) => <AuditCard key={template.idaudit} audit={template} />)
            ) : (
              <p>Aucun template trouvé.</p>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default TemplateList;
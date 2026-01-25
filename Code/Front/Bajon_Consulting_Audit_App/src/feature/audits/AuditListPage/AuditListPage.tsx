import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../supabaseClient';
import AuditCard from '../AuditCard/AuditCard';
import SearchBar from '../../../components/SearchBar';
import './AuditListPage.css';
import { Plus } from "lucide-react";

interface Audit {
  id: string | null;
  auditname: string | null;
  template: boolean;
  archived: boolean;
  idaudittype: string;
  idauditoffer: string;
  idstatus: string;
  audittype: { id: string; nameaudittype: string } | null;
  auditoffer: { id: string; nameauditoffer: string } | null;
  status: { id: string; auditstatus: string } | null;
  creation_user_id?: string | null;
  creation_date?: string | null;
  creation_time?: string | null;
  last_modif_user_id?: string | null;
  last_modif_date?: string | null;
  last_modif_time?: string | null;
}

function AuditList() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(false);

  // États pour filtres et tri
  const [searchTerm, setSearchTerm] = useState('');
  const [auditType, setAuditType] = useState('');
  const [offerType, setOfferType] = useState('');
  const [statusType, setStatusType] = useState('');
  const [showArchived, setShowArchived] = useState('FALSE');
  const [sortField, setSortField] = useState('alphabetique');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Récupération des audits depuis Supabase
  const fetchAudits = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from('audit')
      .select(`
        *,
        audittype ( id, nameaudittype ),
        auditoffer ( id, nameauditoffer ),
        status ( id, auditstatus )
      `)
      .eq('template', false);

    if (searchTerm.trim() !== '') query = query.ilike('auditname', `%${searchTerm}%`);
    if (auditType) query = query.eq('idaudittype', auditType);
    if (offerType) query = query.eq('idauditoffer', offerType);
    if (statusType) query = query.eq('idstatus', statusType);
    if (showArchived) query = query.eq("archived", showArchived);

    const { data: auditsData, error } = await query;

    if (error) {
      console.error('Erreur Supabase (audit) :', error);
      setLoading(false);
      return;
    }

    const auditsWithDates = await Promise.all(
      (auditsData || []).map(async (audit) => {
        const { data: modifies, error: modifyError } = await supabase
          .from('modify')
          .select(`
    user_id,
    modificationdate,
    modificationtime
  `)
          .eq('idaudit', audit.id)
          .order('modificationdate', { ascending: true })
          .order('modificationtime', { ascending: true });

        if (modifyError) {
          console.error('Erreur lors de la récupération des modifications :', modifyError);
          return audit;
        }

        if (modifies && modifies.length > 0) {
          const creation = modifies[0];
          const last = modifies[modifies.length - 1];
          console.log('Modification audit ID', audit.id, '=>', { creation, last });
          return {
            ...audit,
            creation_user_id: creation.user_id,
            creation_date: creation.modificationdate,
            creation_time: creation.modificationtime,
            last_modif_user_id: last.user_id,
            last_modif_date: last.modificationdate,
            last_modif_time: last.modificationtime,
          };
        }

        return audit;

      })
    );
    console.log('Audits avec dates :', auditsWithDates);
    const sortedAudits = [...auditsWithDates];

    if (sortField === 'alphabetique') {
      sortedAudits.sort((a, b) =>
        sortOrder === 'asc'
          ? a.auditname.localeCompare(b.auditname)
          : b.auditname.localeCompare(a.auditname)
      );
    } else if (sortField === 'date_creation') {
      sortedAudits.sort((a, b) => {
        const aDate = new Date(`${a.creation_date || '1970-01-01'}T${a.creation_time || '00:00:00'}`);
        const bDate = new Date(`${b.creation_date || '1970-01-01'}T${b.creation_time || '00:00:00'}`);
        return sortOrder === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
      });
    } else if (sortField === 'derniere_modification') {
      sortedAudits.sort((a, b) => {
        const aDate = new Date(`${a.last_modif_date || '1970-01-01'}T${a.last_modif_time || '00:00:00'}`);
        const bDate = new Date(`${b.last_modif_date || '1970-01-01'}T${b.last_modif_time || '00:00:00'}`);
        return sortOrder === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
      });
    }

    setAudits(sortedAudits);
    setLoading(false);
  }, [searchTerm, auditType, offerType, statusType, showArchived, sortField, sortOrder]);

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]);

  // Affichage
  return (
    <div className="audit-list-page">
      <SearchBar
        variant="audit"
        onSearchChange={setSearchTerm}
        onAuditTypeChange={setAuditType}
        onOfferTypeChange={setOfferType}
        onStatusTypeChange={setStatusType}
        onArchivedChange={setShowArchived}
        onSortChange={setSortField}
        onSortOrderChange={setSortOrder}
      />

      <a href="/newaudit" className="add-audit-btn">
        <Plus className="icon" /> Ajouter un nouvel audit
      </a>

      <div className="audit-list">
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="audit-grid">
            {audits.length > 0 ? (
              audits.map((audit) => <AuditCard key={audit.id} audit={audit} onArchiveToggle={fetchAudits} />)
            ) : (
              <p>Aucun audit trouvé.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditList;

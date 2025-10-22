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

  // Récupération des audits depuis Supabase
  const fetchAudits = useCallback(async () => {
    setLoading(true);

    // Récupération des audits avec leurs types et offres
    let query = supabase
      .from('audit')
      .select(`
        *,
        audittype ( id, nameaudittype ),
        auditoffer ( id, nameauditoffer )
      `)
      .eq('template', false);

    // Filtres
    if (searchTerm.trim() !== '') query = query.ilike('auditname', `%${searchTerm}%`);
    if (auditType) query = query.eq('idaudittype', auditType);
    if (offerType) query = query.eq('idauditoffer', offerType);

    const { data: auditsData, error } = await query;

    if (error) {
      console.error('Erreur Supabase (audit) :', error);
      setLoading(false);
      return;
    }

    // Ajout des infos de création et dernière modif
    const auditsWithDates = await Promise.all(
      (auditsData || []).map(async (audit) => {
        const { data: modifies, error: modifyError } = await supabase
          .from('modify')
          .select(`
            modificationdate,
            modificationtime,
            staff ( firstname, lastname )
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

          return {
            ...audit,
            creation_date: creation.modificationdate,
            creation_time: creation.modificationtime,
            creation_staff_firstname: creation.staff?.firstname,
            creation_staff_lastname: creation.staff?.lastname,
            last_modif_date: last.modificationdate,
            last_modif_time: last.modificationtime,
            last_modif_staff_firstname: last.staff?.firstname,
            last_modif_staff_lastname: last.staff?.lastname,
          };
        }

        // Aucun enregistrement dans "modify"
        return {
          ...audit,
          creation_date: null,
          creation_time: null,
          creation_staff_firstname: null,
          creation_staff_lastname: null,
          last_modif_date: null,
          last_modif_time: null,
          last_modif_staff_firstname: null,
          last_modif_staff_lastname: null,
        };
      })
    );

    // Tri local
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

    // Mise à jour de l’état
    setAudits(sortedAudits);
    setLoading(false);
  }, [searchTerm, auditType, offerType, sortField, sortOrder]);

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
              audits.map((audit) => <AuditCard key={audit.id} audit={audit} />)
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

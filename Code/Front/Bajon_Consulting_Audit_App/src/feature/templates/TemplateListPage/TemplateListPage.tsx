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

  // Récupération des templates depuis Supabase
  const fetchTemplates = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from('audit')
      .select(`
        *,
        audittype ( id, nameaudittype ),
        auditoffer ( id, nameauditoffer )
      `)
      .eq('template', true);

    if (searchTerm.trim() !== '') query = query.ilike('auditname', `%${searchTerm}%`);
    if (auditType) query = query.eq('idaudittype', auditType);
    if (offerType) query = query.eq('idauditoffer', offerType);

    const { data: templatesData, error } = await query;

    if (error) {
      console.error('Erreur Supabase (template) :', error);
      setLoading(false);
      return;
    }

    const TemplatesWithDates = await Promise.all(
      (templatesData || []).map(async (template) => {
        const { data: modifies, error: modifyError } = await supabase
          .from('modify')
          .select(`
            modificationdate,
            modificationtime,
            staff ( firstname, lastname )
          `)
          .eq('idaudit', template.id)
          .order('modificationdate', { ascending: true })
          .order('modificationtime', { ascending: true });

        if (modifyError) {
          console.error('Erreur lors de la récupération des modifications :', modifyError);
          return template;
        }

        if (modifies && modifies.length > 0) {
          const creation = modifies[0];
          const last = modifies[modifies.length - 1];

          return {
            ...template,
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

        return {
          ...template,
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

    const sortedTemplates = [...TemplatesWithDates];

    if (sortField === 'alphabetique') {
      sortedTemplates.sort((a, b) =>
        sortOrder === 'asc'
          ? a.auditname.localeCompare(b.auditname)
          : b.auditname.localeCompare(a.auditname)
      );
    } else if (sortField === 'date_creation') {
      sortedTemplates.sort((a, b) => {
        const aDate = new Date(`${a.creation_date || '1970-01-01'}T${a.creation_time || '00:00:00'}`);
        const bDate = new Date(`${b.creation_date || '1970-01-01'}T${b.creation_time || '00:00:00'}`);
        return sortOrder === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
      });
    } else if (sortField === 'derniere_modification') {
      sortedTemplates.sort((a, b) => {
        const aDate = new Date(`${a.last_modif_date || '1970-01-01'}T${a.last_modif_time || '00:00:00'}`);
        const bDate = new Date(`${b.last_modif_date || '1970-01-01'}T${b.last_modif_time || '00:00:00'}`);
        return sortOrder === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
      });
    }

    setTemplates(sortedTemplates);
    setLoading(false);
  }, [searchTerm, auditType, offerType, sortField, sortOrder]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Affichage
  return (
    <div className="template-list-page">
      <SearchBar
        variant="audit"
        onSearchChange={setSearchTerm}
        onAuditTypeChange={setAuditType}
        onOfferTypeChange={setOfferType}
        onSortChange={setSortField}
        onSortOrderChange={setSortOrder}
      />

      <a href="#" className="add-template-btn">
        <Plus className="icon" /> Ajouter un nouveau template
      </a>

      <div className="template-list">
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="template-grid">
            {templates.length > 0 ? (
              templates.map((template) => <AuditCard key={template.id} audit={template} />)
            ) : (
              <p>Aucun template trouvé.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplateList;
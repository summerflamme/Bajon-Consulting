import './AuditCard.css';
import { useNavigate } from "react-router-dom";
import { HistoryIcon } from '@/components/ui/history';
import { SquarePenIcon } from '@/components/ui/modify';
import { SearchIcon } from '@/components/ui/search';
import { ArchiveIcon } from '@/components/ui/archive';
import { RefreshCCWIcon } from '@/components/ui/refresh-ccw';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';

function AuditCard({ audit, onArchiveToggle }) {
  const [isArchived, setIsArchived] = useState(audit.archived);

  const toggleArchived = async () => {
    try {
      const newArchivedState = !isArchived;
      // Mise à jour via Supabase
      const { error } = await supabase
        .from('audit')
        .update({ archived: newArchivedState })
        .eq('id', audit.id);

      if (error) {
        console.error('Erreur Supabase (toggle archived):', error);
        return;
      }

      // Mise à jour locale après succès
      setIsArchived(newArchivedState);
      console.log(`Audit ${audit.id} archived state updated to ${newArchivedState}`);
      
      // Appel du callback parent pour rafraîchir la liste
      if (onArchiveToggle) {
        onArchiveToggle();
      }
    } catch (error) {
      console.error('Error toggling archive state:', error);
    }
  };

  useEffect (() => {
        // Optionnel : récupérer les données utilisateur si nécessaire
    },
  );
  
  const navigate = useNavigate();
  return (
    <div className="audit-card">
      <div className="audit-card-header">
        <h5 className="audit-card-title"><strong>{audit.auditname}</strong></h5>
      </div>

      <div className="audit-card-body">
        <p className="audit-card-text"><strong>Création :</strong></p>
        <p className="audit-card-text">
          {audit.creation_date} à {audit.creation_time}
        </p>
        <p className="audit-card-text">
          par {audit.creation_staff_firstname || "—"} {audit.creation_staff_lastname || ""}
        </p>
      </div>

      <div className="audit-card-body">
        <p className="audit-card-text"><strong>Type d'Audit :</strong> {audit.audittype?.nameaudittype}</p>
        <p className="audit-card-text"><strong>Type d'Offre :</strong> {audit.auditoffer?.nameauditoffer}</p>
        <p className="audit-card-text"><strong>Statut :</strong> {audit.status?.auditstatus}</p>
      </div>

      <div className="audit-card-body">
        <button className="audit-card-btn" onClick={() => navigate(`/audit/${audit.id}/view`)}><SearchIcon /></button>
        <span className='audit-card-text'> </span>
        <button className="audit-card-btn" onClick={() => navigate(`/audit/${audit.id}/edit`)}><SquarePenIcon /></button>
        <span className='audit-card-text'> </span>
        {isArchived ?(<button className="audit-card-btn" onClick={toggleArchived}><RefreshCCWIcon /> </button>) : (<button className="audit-card-btn" onClick={toggleArchived}><ArchiveIcon /></button>) }
      </div>

      <div className="audit-card-footer">
        <p className="audit-card-text"><strong>Dernière modification :</strong></p>
        <p className="audit-card-text">
          {audit.last_modif_date} à {audit.last_modif_time}
        </p>
        <p className="audit-card-text">
          par {audit.last_modif_staff_firstname || "—"} {audit.last_modif_staff_lastname || ""}
        </p>
        <button className="audit-card-btn"><HistoryIcon /></button>
      </div>
    </div>
  );
}

export default AuditCard;

import './AuditCard.css';
import { useNavigate } from "react-router-dom";
import { HistoryIcon } from '@/components/ui/history';
import { SquarePenIcon } from '@/components/ui/modify';
import { SearchIcon } from '@/components/ui/search';
import { ArchiveIcon } from '@/components/ui/archive';
import { RefreshCCWIcon } from '@/components/ui/refresh-ccw';
import { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import axios from 'axios';

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

interface User {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  currentRole?: string | null;
  created_at?: string | null;
  last_sign_in_at?: string | null;
}

interface AuditCardProps {
  audit: Audit;
  onArchiveToggle?: () => void;
}

function AuditCard({ audit, onArchiveToggle }: AuditCardProps) {
  const [isArchived, setIsArchived] = useState<boolean>(audit.archived === true);
  const [creationUser, setCreationUser] = useState<User | null>(null);
  const [lastModifUser, setLastModifUser] = useState<User | null>(null);

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

  // Récupérer les données des utilisateurs
  useEffect(() => {
    const fetchLastModifUser = async () => {
      if (!audit.last_modif_user_id) return;
      axios
        .get(`http://localhost:8080/api/users/${audit.last_modif_user_id}`)
        .then((response) => {
          setLastModifUser(response.data);
        })
        .catch((error) => {
          console.error("Erreur lors du chargement de l'utilisateur :", error);
        });
    };

    fetchLastModifUser();
    if (!audit.last_modif_user_id) return;
  }, [audit.last_modif_user_id]);

  useEffect(() => {
    const fetchCreationUser = async () => {
      if (!audit.creation_user_id) return;
      axios
        .get(`http://localhost:8080/api/users/${audit.creation_user_id}`)
      .then((response) => {
        setCreationUser(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement de l'utilisateur :", error);
      });

    };
    fetchCreationUser();
    if (!audit.creation_user_id) return;
  }, [audit.creation_user_id]);

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
          par {creationUser ? `${creationUser.firstName} ${creationUser.lastName}` : audit.creation_user_id}
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
          par {lastModifUser ? `${lastModifUser.firstName} ${lastModifUser.lastName}` : audit.creation_user_id}
        </p>
        <button className="audit-card-btn"><HistoryIcon /></button>
      </div>
    </div>
  );
}

export default AuditCard;

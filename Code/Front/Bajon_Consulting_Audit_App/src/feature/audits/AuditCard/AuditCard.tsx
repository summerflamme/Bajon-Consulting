import './AuditCard.css';
import { useNavigate } from "react-router-dom";
import { DeleteIcon } from '@/components/ui/delete';
import { HistoryIcon } from '@/components/ui/history';
import { SquarePenIcon } from '@/components/ui/modify';
import { SearchIcon } from '@/components/ui/search';

function AuditCard({ audit }) {
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
        <p className="audit-card-text"><strong>Statut :</strong> {audit.status}</p>
      </div>

      <div className="audit-card-body">
        <button className="audit-card-btn" onClick={() => navigate(`/audit/${audit.id}/view`)}><SearchIcon /></button>
        <span className='audit-card-text'> </span>
        <button className="audit-card-btn" onClick={() => navigate(`/audit/${audit.id}/edit`)}><SquarePenIcon /></button>
        <span className='audit-card-text'> </span>
        <button className="audit-card-btn"><DeleteIcon /></button>
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

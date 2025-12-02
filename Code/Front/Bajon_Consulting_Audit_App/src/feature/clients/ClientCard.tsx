import "./clients.css";
import { DeleteIcon } from "../../components/ui/delete";
import { SquarePenIcon } from "../../components/ui/square-pen";
import { SearchIcon } from "../../components/ui/search";

interface ClientCardProps {
  id: string;
  clientFirstName?: string;
  clientLastName?: string;
  companyName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  clientCity?: string;

  onConsult?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function ClientCard({
  id,
  clientFirstName,
  clientLastName,
  companyName,
  clientEmail,
  clientPhone,
  clientAddress,
  clientCity,
  onConsult,
  onEdit,
  onDelete,
}: ClientCardProps) {
  return (
    <div className="client-row">

      {/* NOM + PRÉNOM */}
      <div className="client-cell">
        {`${clientLastName || ""} ${clientFirstName || ""}`.trim() || "-"}
      </div>

      {/* SOCIÉTÉ */}
      <div className="client-cell">
        {companyName || "-"}
      </div>

      {/* EMAIL */}
      <div className="client-cell">
        {clientEmail || "-"}
      </div>

      {/* TÉLÉPHONE */}
      <div className="client-cell">
        {clientPhone || "-"}
      </div>

      {/* ADRESSE + VILLE */}
      <div className="client-cell">
        {`${clientAddress || ""} ${clientCity || ""}`.trim() || "-"}
      </div>

      {/* ACTIONS */}
      <div className="client-cell actions">
        <button
          onClick={() => onConsult?.(id)}
          className="client-list-btn"
          title="Consulter"
        >
          <SearchIcon size={22} />
        </button>

        <button
          onClick={() => onEdit?.(id)}
          className="client-list-btn"
          title="Modifier"
        >
          <SquarePenIcon size={22} />
        </button>

        <button
          onClick={() => onDelete?.(id)}
          className="client-list-btn"
          title="Supprimer"
        >
          <DeleteIcon size={22} />
        </button>
      </div>

    </div>
  );
}

export default ClientCard;

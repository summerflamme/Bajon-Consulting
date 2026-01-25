import './users.css';
import { DeleteIcon } from "../../components/ui/delete";
import { SquarePenIcon } from "../../components/ui/square-pen";
import { SearchIcon } from "../../components/ui/search";

interface UserCardProps {
  id: string; // <- string, car ton backend renvoie un UUID
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
  onConsult?: (id: string) => void; // 
  onEdit?: (id: string) => void;    // 
  onDelete?: (id: string) => void;  //  ajouté
}

function UserCard({
  id,
  firstName,
  lastName,
  email,
  phone,
  createdAt,
  updatedAt,
  onConsult,
  onEdit,
  onDelete,
}: UserCardProps) {

  return (
    <div className="user-row">
      <div className="user-cell">{`${lastName || ""} ${firstName || ""}`}</div>
      <div className="user-cell">{email || "-"}</div>
      <div className="user-cell">{phone || "-"}</div>
      <div className="user-cell">
        {createdAt ? new Date(createdAt).toLocaleDateString() : "-"}
      </div>
      <div className="user-cell">
        {updatedAt ? new Date(updatedAt).toLocaleDateString() : "-"}
      </div>
      <div className="user-cell actions">
        <button
          onClick={() => onConsult?.(id)}
          className="user-list-btn"
          title="Consulter"
        >
          <SearchIcon size={22} />
        </button>
        <button
          onClick={() => onEdit?.(id)}
          className="user-list-btn"
          title="Modifier"
        >
          <SquarePenIcon size={22} />
        </button>
        <button
          onClick={() => onDelete?.(id)}
          className="user-list-btn"
          title="Supprimer"
        >
          <DeleteIcon size={22} />
        </button>
      </div>
    </div>
  );
}

export default UserCard;

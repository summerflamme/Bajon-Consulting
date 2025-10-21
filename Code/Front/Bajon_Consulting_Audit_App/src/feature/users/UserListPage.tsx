import SearchBar from "../../components/SearchBar";
import UserCard from "./UserCard";
import './users.css';
import { Plus } from "lucide-react";

const users = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function UserList() {
    const handleAddUser = () => {
        console.log("Ajouter un utilisateur");
    };

    return (
        <div className="fond-users-list">
            <SearchBar variant="users" />
            <div className="user-page-container">
                <div className="user-list-header">
                    <button onClick={handleAddUser} className="user-list-btn">
                        <Plus className="icon" />
                        Ajouter un utilisateur
                    </button>
                </div>

                <div className="user-list-wrapper">
                    <div className="user-header-row">
                        <div className="user-cell">Nom</div>
                        <div className="user-cell">Email</div>
                        <div className="user-cell">Téléphone</div>
                        <div className="user-cell">Créé le</div>
                        <div className="user-cell">Dernière connexion</div>
                        <div className="user-cell actions">Actions</div>
                    </div>

                    {users.map((_, idx) => (
                        <UserCard key={idx} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserList;

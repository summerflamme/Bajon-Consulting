import SearchBar from "../../components/SearchBar";
import UserCard from "./UserCard";
import './users.css';

const users = [1, 2, 3, 4, 5, 6];

function UserList() {
    return (
        <>
            <SearchBar variant="users"/>

            <div className="user-list-wrapper">
                {/* Header */}
                <div className="user-header-row">
                    <div className="user-cell">Nom</div>
                    <div className="user-cell">Email</div>
                    <div className="user-cell">Téléphone</div>
                    <div className="user-cell">Créé le</div>
                    <div className="user-cell">Dernière connexion</div>
                    <div className="user-cell actions">Actions</div>
                </div>

                {/* Lignes utilisateurs */}
                {users.map((_, idx) => (
                    <UserCard key={idx} />
                ))}
            </div>
        </>
    );
}

export default UserList;

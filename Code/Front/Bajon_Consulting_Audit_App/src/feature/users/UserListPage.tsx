import SearchBar from "../../components/SearchBar";
import UserCard from "./UserCard";
import './users.css';

const users = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]; // Remplacer par de vraies données

function UserList() {
    return (
        <>
            <SearchBar variant="users"/>

            <div className="user-list-table">
                <div className="user-header-row">
                    <div className="user-cell">Nom</div>
                    <div className="user-cell">Email</div>
                    <div className="user-cell">UID</div>
                    <div className="user-cell">Téléphone</div>
                    <div className="user-cell">Créé le</div>
                    <div className="user-cell">Dernière connexion</div>
                    <div className="user-cell actions">Actions</div>
                </div>

                {users.map((_user, idx) => (
                    <UserCard key={idx} />
                ))}
            </div>
        </>
    );
}

export default UserList;
import './users.css';
import { DeleteIcon } from "../../components/ui/delete";
import { SquarePenIcon } from "../../components/ui/square-pen";
import {SearchIcon} from "../../components/ui/search";

function UserCard() {
    const handleCoUser = () => {
        console.log("Consulter un utilisateur");
    };
    const handleMoUser = () => {
        console.log("Consulter un utilisateur");
    };
    const handleSuUser = () => {
        console.log("Consulter un utilisateur");
    };
    return (
        <div className="user-row">
            <div className="user-cell">Nom Prénom</div>
            <div className="user-cell">email@exemple.com</div>
            <div className="user-cell">06 12 34 56 78</div>
            <div className="user-cell">01/01/2023</div>
            <div className="user-cell">06/10/2025</div>
            <div className="user-cell actions">
                <button onClick={handleCoUser} className="user-list-btn">
                    <SearchIcon size={28}/>
                </button>
                <button onClick={handleMoUser} className="user-list-btn">
                    <SquarePenIcon size={28}/>
                </button>
                <button onClick={handleSuUser} className="user-list-btn">
                    <DeleteIcon size={28} />
                </button>
            </div>
        </div>
    );
}

export default UserCard;
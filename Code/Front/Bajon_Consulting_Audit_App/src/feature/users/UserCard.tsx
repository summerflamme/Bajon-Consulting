import './users.css';

function UserCard() {
    return (
        <div className="user-row">
            <div className="user-cell">Nom Prénom</div>
            <div className="user-cell">email@exemple.com</div>
            <div className="user-cell">06 12 34 56 78</div>
            <div className="user-cell">01/01/2023</div>
            <div className="user-cell">06/10/2025</div>
            <div className="user-cell actions">
                <a href="#" className="btn btn-primary">CO</a>
                <a href="#" className="btn btn-primary">MO</a>
                <a href="#" className="btn btn-primary">SU</a>
            </div>
        </div>
    );
}

export default UserCard;
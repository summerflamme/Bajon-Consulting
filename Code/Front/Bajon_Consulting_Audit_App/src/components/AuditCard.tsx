import './components.css';

function AuditCard() {
  return (
    <><div>
      <div className="card-header">
        <h5 className="card-title"> <strong> TITRE_AUDIT </strong> </h5>
      </div>
      <div className="card-body">
        <p className='card-text'> <strong> Type d'Offre : </strong> TYPE_OFFRE </p>
        <p className='card-text'> <strong> Type d'Audit : </strong> TYPE_AUDIT </p>
        <p className='card-text'> <strong> Statut : </strong> STATUT_AUDIT </p>
        <div>
          <a href="#" className="btn btn-primary">Consulter</a>
          <span className='card-text'> </span>
          <a href="#" className="btn btn-primary">Modifier</a>
          <span className='card-text'> </span>
          <a href="#" className="btn btn-primary">Supprimer</a>
        </div>
      </div>
      <div className="card-footer">
        <p className='card-text'> Créé le DATE_CREATION par NOM_CREATEUR </p>
          <p className='card-text'> Modifié le DATE_MODIF par NOM_MODIF </p>
      </div>
    </div>
    </>
  );
}

export default AuditCard
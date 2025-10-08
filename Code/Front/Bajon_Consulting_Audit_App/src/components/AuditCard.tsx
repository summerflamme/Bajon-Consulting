import './components.css';

function AuditCard({ audit }) {
  return (
    <><div>
      <div className="card-header">
        <h5 className="card-title"> <strong> {audit.auditname} </strong> </h5>
      </div>
      <div className="card-body">
        <p className='card-text'> <strong> Type d'Offre : </strong> TYPE_OFFRE </p>
        <p className='card-text'> <strong> Type d'Audit : </strong> TYPE_AUDIT </p>
        <p className='card-text'> <strong> Statut : </strong> {audit.status} </p>
      </div>
      <div className="card-body">
        <a href="#" className="btn btn-primary">Consulter</a>
        <span className='card-text'> </span>
        <a href="#" className="btn btn-primary">Modifier</a>
        <span className='card-text'> </span>
        <a href="#" className="btn btn-primary">Supprimer</a>
      </div>
      <div className="card-footer">
        <p className='card-text'> Créé le {audit.creationdate} par Titouan </p>
          <p className='card-text'> Modifié le DATE_MODIF par NOM_MODIF </p>
      </div>
    </div>
    </>
  );
}

export default AuditCard
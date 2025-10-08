import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './components.css';

function AuditCard({ audit }) {
  const [typeoffer, setTypeOffer] = useState<any[]>([]);
  const [typeaudit, setTypeAudit] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupération des données dans Supabase
  useEffect(() => {
  const fetchTypeOffer = async () => {
    const { data, error } = await supabase
      .from("auditoffer")
      .select("*")
      .eq('idauditoffer', audit.idauditoffer)

    if (error) {
      console.error("Erreur de récupération :", error);
    } else {
      setTypeOffer(data || []);
    }
    setLoading(false);
  };

  fetchTypeOffer();
  }, []);

  useEffect(() => {
  const fetchTypeAudit = async () => {
    const { data, error } = await supabase
      .from("audittype")
      .select("*")
      .eq('idaudittype', audit.idaudittype)

    if (error) {
      console.error("Erreur de récupération :", error);
    } else {
      setTypeAudit(data || []);
    }
    setLoading(false);
  };

  fetchTypeAudit();
  }, []);

  if (loading) return <p>Chargement ...</p>;

  // Affichage
  return (
    <>
      <div>
        <div className="card-header">
          <h5 className="card-title"> <strong> {audit.auditname} </strong> </h5>
        </div>
        <div className="card-body">
          <p className='card-text'> Création le {audit.creationdate} par Titouan </p>
        </div>
        <div className="card-body">
          <p className='card-text'> <strong> Type d'Offre : </strong> {typeoffer.map(auditoffer => (auditoffer.nameauditoffer))} </p>
          <p className='card-text'> <strong> Type d'Audit : </strong> {typeaudit.map(audittype => (audittype.nameaudittype))} </p>
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
          <p className='card-text'> Dernière modification le : </p>
          <p className='card-text'> DATE_MODIF à HEURE_MODIF par NOM_MODIF </p>
        </div>
    </div>
    </>
  );
}

export default AuditCard
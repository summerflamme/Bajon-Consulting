import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import './components.css';

function AuditCard({ audit }) {
  const [typeoffer, setTypeOffer] = useState<any[]>([]);
  const [typeaudit, setTypeAudit] = useState<any[]>([]);
  const [creation, setCreation] = useState<any[]>([]);
  const [lastmodif, setLastModif] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupération des données dans Supabase
  // Type d'Audit
  useEffect(() => {
  const fetchTypeAudit = async () => {
    const { data, error } = await supabase
      .from("audittype")
      .select("*")
      .eq('id', audit.idaudittype)

    if (error) {
      console.error("Erreur de récupération :", error);
    } else {
      setTypeAudit(data || []);
    }
    setLoading(false);
  };
  fetchTypeAudit();
  }, [audit.idaudittype]);
  
  // Type d'Offre
  useEffect(() => {
  const fetchTypeOffer = async () => {
    const { data, error } = await supabase
      .from("auditoffer")
      .select("*")
      .eq('id', audit.idauditoffer)

    if (error) {
      console.error("Erreur de récupération :", error);
    } else {
      setTypeOffer(data || []);
    }
    setLoading(false);
  };
  fetchTypeOffer();
  }, [audit.idauditoffer]);

  // Création (Première modification)
  useEffect(() => {
  const fetchCreation = async () => {
    const { data, error } = await supabase
    .from('modify')
    .select(`
      idaudit,
      modificationdate,
      modificationtime,
      audit (
        id,
        auditname,
        status
      ),
      staff (
        id,
        firstname,
        lastname
      )
    `)
    .eq('idaudit', audit.id)
    .order('modificationdate', { ascending: true })
    .order('modificationtime', { ascending: true })
    .limit(1);

    if (error) {
      console.error("Erreur de récupération :", error);
    } else {
      setCreation(data || []);
    }
    setLoading(false);
  };
  fetchCreation();
  }, [audit.id]);
  
  // Dernière modification
  useEffect(() => {
  const fetchLastModif = async () => {
    const { data, error } = await supabase
    .from('modify')
    .select(`
      idaudit,
      modificationdate,
      modificationtime,
      audit (
        id,
        auditname,
        status
      ),
      staff (
        id,
        firstname,
        lastname
      )
    `)
    .eq('idaudit', audit.id)
    .order('modificationdate', { ascending: false })
    .order('modificationtime', { ascending: false })
    .limit(1);

    if (error) {
      console.error("Erreur de récupération :", error);
    } else {
      setLastModif(data || []);
    }
    setLoading(false);
  };
  fetchLastModif();
  }, [audit.id]);

  if (loading) return <p>Chargement ...</p>;

  // Affichage
  return (
    <>
      <div>
        <div className="card-header">
          <h5 className="card-title"> <strong> {audit.auditname} </strong> </h5>
        </div>
        <div className="card-body">
          <p className='card-text'> <strong> Création : </strong> </p>
          <p className='card-text'> {creation.map(modify => (modify.modificationdate))} à {creation.map(modify => (modify.modificationtime))} </p>
          <p className='card-text'> par {creation.map(modify => (modify.staff.firstname))} {creation.map(modify => (modify.staff.lastname))} </p>
        </div>
        <div className="card-body">
          <p className='card-text'> <strong> Type d'Audit : </strong> {typeaudit.map(audittype => (audittype.nameaudittype))} </p>
          <p className='card-text'> <strong> Type d'Offre : </strong> {typeoffer.map(auditoffer => (auditoffer.nameauditoffer))} </p>
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
          <p className='card-text'> <strong> Dernière modification : </strong> </p>
          <p className='card-text'> {lastmodif.map(modify => (modify.modificationdate))} à {lastmodif.map(modify => (modify.modificationtime))} </p>
          <p className='card-text'> par {lastmodif.map(modify => (modify.staff.firstname))} {lastmodif.map(modify => (modify.staff.lastname))} </p>
          <a href="#" className="btn btn-primary">Historique</a>
          <p> </p>
        </div>
    </div>
    </>
  );
}

export default AuditCard
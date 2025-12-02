import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './components.css';
import { ArrowUpIcon } from "../components/ui/arrow-up";
import { ArrowDownIcon } from "../components/ui/arrow-down";

type SortOrder = 'asc' | 'desc';
type SearchVariant = 'audit' | 'users' | 'template' | 'default' | 'clients';

type SearchBarProps = {
  variant?: SearchVariant;
  onSearchChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
  onAuditTypeChange?: (value: string) => void;
  onOfferTypeChange?: (value: string) => void;
  onSortOrderChange?: (order: SortOrder) => void;
  onRoleFilterChange?: (value: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  variant = 'default',
  onSearchChange,
  onSortChange,
  onAuditTypeChange,
  onOfferTypeChange,
  onSortOrderChange,
  onRoleFilterChange,
}) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [offerTypes, setOfferTypes] = useState<any[]>([]);
  const [auditTypes, setAuditTypes] = useState<any[]>([]);

  const toggleSortOrder = () => {
    const newOrder: SortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    onSortOrderChange?.(newOrder);
  };

  // === Récupération types audits/offres ===
  useEffect(() => {
    const fetchOfferTypes = async () => {
      const { data, error } = await supabase.from("auditoffer").select("*");
      if (!error) setOfferTypes(data || []);
      else console.error("Erreur de récupération des offres :", error);
    };

    const fetchAuditTypes = async () => {
      const { data, error } = await supabase.from("audittype").select("*");
      if (!error) setAuditTypes(data || []);
      else console.error("Erreur de récupération des audits :", error);
    };

    if (variant === 'audit') {
      fetchOfferTypes();
      fetchAuditTypes();
    }
  }, [variant]);

  return (
    <div className="advanced-search-bar">

      {/* 🔍 Champ de recherche dynamique */}
      <input
        type="text"
        placeholder={
          variant === 'users'
            ? "Rechercher un utilisateur..."
            : variant === 'clients'
            ? "Rechercher un client..."
            : "Rechercher..."
        }
        className="search-input"
        onChange={(e) => onSearchChange?.(e.target.value)}
      />

      {/* === AUDITS === */}
      {variant === 'audit' && (
        <>
          <select className="search-select" onChange={(e) => onAuditTypeChange?.(e.target.value)}>
            <option value="">Tout (Type d'audit)</option>
            {auditTypes.map((auditType) => (
              <option key={auditType.id} value={auditType.id}>
                {auditType.nameaudittype}
              </option>
            ))}
          </select>

          <select className="search-select" onChange={(e) => onOfferTypeChange?.(e.target.value)}>
            <option value="">Tout (Type d'offre)</option>
            {offerTypes.map((offerType) => (
              <option key={offerType.id} value={offerType.id}>
                {offerType.nameauditoffer}
              </option>
            ))}
          </select>

          <select className="search-select" onChange={(e) => onSortChange?.(e.target.value)}>
            <option value="alphabetique">Ordre alphabétique</option>
            <option value="date_creation">Date de création</option>
            <option value="derniere_modification">Dernière modification</option>
          </select>
        </>
      )}

      {/* === USERS === */}
      {variant === 'users' && (
        <>
          <select className="search-select" onChange={(e) => onRoleFilterChange?.(e.target.value)}>
            <option value="">Tout (Rôle)</option>
            <option value="Administrateur">Administrateur</option>
            <option value="Utilisateur">Utilisateur</option>
          </select>

          <select className="search-select" onChange={(e) => onSortChange?.(e.target.value)}>
            <option value="alphabetique">Ordre alphabétique</option>
            <option value="date_inscription">Date d'inscription</option>
            <option value="last_connexion">Dernière connexion</option>
          </select>
        </>
      )}

      {/* === 🆕 CLIENTS === */}
      {variant === 'clients' && (
        <>
          {/* Seulement tri alphabétique */}
          <select className="search-select" onChange={(e) => onSortChange?.(e.target.value)}>
            <option value="alphabetique">Ordre alphabétique</option>
          </select>
        </>
      )}

      {/* 🔁 Bouton tri asc/desc */}
      <button
        className="sort-order-button"
        onClick={toggleSortOrder}
        aria-label={`Trier`}
        type="button"
      >
        {sortOrder === 'asc'
          ? <ArrowUpIcon className='arrow-icon' />
          : <ArrowDownIcon className='arrow-icon' />}
      </button>
    </div>
  );
};

export default SearchBar;

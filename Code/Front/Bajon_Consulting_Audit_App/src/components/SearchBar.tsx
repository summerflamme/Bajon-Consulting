import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './components.css';

type SortOrder = 'asc' | 'desc';

type SearchBarProps = {
  onSearchChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
  onAuditTypeChange?: (value: string) => void;
  onOfferTypeChange?: (value: string) => void;
  onSortOrderChange?: (order: SortOrder) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  onSearchChange,
  onSortChange,
  onAuditTypeChange,
  onOfferTypeChange,
  onSortOrderChange,
}) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [offerTypes, setOfferTypes] = useState<any[]>([]);
  const [auditTypes, setAuditTypes] = useState<any[]>([]);

  const toggleSortOrder = () => {
    const newOrder: SortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    onSortOrderChange?.(newOrder);
  };

  // Récupération des données dans Supabase
  // Type d'Offre
  useEffect(() => {
  const fetchOfferTypes = async () => {
    const { data, error } = await supabase
      .from("auditoffer")
      .select("*")
    if (error) {
      console.error("Erreur de récupération :", error);
    } else {
      setOfferTypes(data || []);
    }
  };
  fetchOfferTypes();
  }, []);

  // Type d'Audit
  useEffect(() => {
  const fetchAuditTypes = async () => {
    const { data, error } = await supabase
      .from("audittype")
      .select("*")
    if (error) {
      console.error("Erreur de récupération :", error);
    } else {
      setAuditTypes(data || []);
    }
  };
  fetchAuditTypes();
  }, []);

  return (
    <div className="advanced-search-bar">
      <input
        type="text"
        placeholder="Rechercher..."
        className="search-input"
        onChange={(e) => onSearchChange?.(e.target.value)}
      />

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
        <option value="date">Date</option>
      </select>

      <button
        className="sort-order-button"
        onClick={toggleSortOrder}
        aria-label={`Trier en ordre ${sortOrder === 'asc' ? 'croissant' : 'décroissant'}`}
        type="button"
      >
        {sortOrder === 'asc' ? '⬆️' : '⬇️'}
      </button>
    </div>
  );
};

export default SearchBar;

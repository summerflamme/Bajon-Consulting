import React, { useState } from 'react';
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

  const toggleSortOrder = () => {
    const newOrder: SortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    onSortOrderChange?.(newOrder);
  };

  return (
    <div className="advanced-search-bar">
      <input
        type="text"
        placeholder="Rechercher..."
        className="search-input"
        onChange={(e) => onSearchChange?.(e.target.value)}
      />

      <select className="search-select" onChange={(e) => onAuditTypeChange?.(e.target.value)}>
        <option value="">Type d'audit</option>
        <option value="cloud">Cloud</option>
        <option value="cybersecurite">Cybersécurité</option>
        <option value="reseau">Réseau</option>
        <option value="systeme">Système</option>
      </select>

      <select className="search-select" onChange={(e) => onOfferTypeChange?.(e.target.value)}>
        <option value="">Type d'offre</option>
        <option value="essentiel">Essentiel</option>
        <option value="avance">Avancé</option>
        <option value="flash">Flash</option>
      </select>

      <select className="search-select" onChange={(e) => onSortChange?.(e.target.value)}>
        <option value="">Trier par</option>
        <option value="alphabetique">Ordre alphabétique</option>
        <option value="date">Date</option>
        <option value="date">Taille</option>
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

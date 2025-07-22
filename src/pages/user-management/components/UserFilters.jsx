import React, { useState } from 'react';

import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const UserFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const roleOptions = [
    { value: '', label: 'Todos los roles' },
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Usuario' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          fullWidth
        >
          Filtros
        </Button>
      </div>

      {/* Filter Content */}
      <div className={`space-y-4 ${!isExpanded ? 'hidden lg:block' : ''}`}>
        {/* Search */}
        <div>
          <Input
            label="Buscar usuario"
            type="search"
            placeholder="Nombre o email..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Role Filter */}
        <div>
          <Select
            label="Rol"
            options={roleOptions}
            value={filters.role}
            onChange={(value) => handleFilterChange('role', value)}
          />
        </div>

        {/* Status Filter */}
        <div>
          <Select
            label="Estado"
            options={statusOptions}
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 gap-3">
          <Input
            label="Fecha desde"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
          />
          <Input
            label="Fecha hasta"
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
          />
        </div>

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={onClearFilters}
          iconName="X"
          iconPosition="left"
          fullWidth
        >
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
};

export default UserFilters;
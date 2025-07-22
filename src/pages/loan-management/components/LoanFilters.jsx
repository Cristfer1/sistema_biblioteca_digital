import React from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const LoanFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  isCollapsed,
  onToggleCollapse,
  books
}) => {
  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'active', label: 'Activo' },
    { value: 'returned', label: 'Devuelto' },
    { value: 'overdue', label: 'Vencido' }
  ];

  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    ...Array.from(new Set(books?.map(book => book?.category)))
      .filter(Boolean)
      .map(category => ({
        value: category,
        label: category.charAt(0).toUpperCase() + category.slice(1)
      }))
  ];

  const handleInputChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const handleDateRangeChange = (rangeField, dateField, value) => {
    onFilterChange({
      ...filters,
      [rangeField]: {
        ...filters[rangeField],
        [dateField]: value
      }
    });
  };

  const hasActiveFilters = Object.values(filters || {}).some(value => {
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== '');
    }
    return value !== '';
  });

  if (isCollapsed) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <Button
          variant="ghost"
          onClick={onToggleCollapse}
          className="w-full"
          iconName="ChevronRight"
        />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={16} />
          <h3 className="font-medium text-text-primary">Filtros</h3>
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              className="text-text-secondary hover:text-text-primary"
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            iconName="ChevronLeft"
          />
        </div>
      </div>

      {/* Filter Content */}
      <div className="p-4 space-y-4">
        {/* Search */}
        <div>
          <Input
            label="Búsqueda"
            placeholder="ID, usuario, libro, ISBN..."
            value={filters?.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
          />
        </div>

        {/* Status */}
        <div>
          <Select
            label="Estado del Préstamo"
            options={statusOptions}
            value={filters?.status || ''}
            onChange={(value) => handleInputChange('status', value)}
            placeholder="Seleccionar estado"
          />
        </div>

        {/* Loan Date Range */}
        <div>
          <label className="text-sm font-medium text-text-primary mb-2 block">
            Fecha de Préstamo
          </label>
          <div className="space-y-2">
            <Input
              type="date"
              placeholder="Fecha desde"
              value={filters?.loanDateRange?.from || ''}
              onChange={(e) => handleDateRangeChange('loanDateRange', 'from', e.target.value)}
            />
            <Input
              type="date"
              placeholder="Fecha hasta"
              value={filters?.loanDateRange?.to || ''}
              onChange={(e) => handleDateRangeChange('loanDateRange', 'to', e.target.value)}
            />
          </div>
        </div>

        {/* Return Date Range */}
        <div>
          <label className="text-sm font-medium text-text-primary mb-2 block">
            Fecha de Devolución
          </label>
          <div className="space-y-2">
            <Input
              type="date"
              placeholder="Fecha desde"
              value={filters?.returnDateRange?.from || ''}
              onChange={(e) => handleDateRangeChange('returnDateRange', 'from', e.target.value)}
            />
            <Input
              type="date"
              placeholder="Fecha hasta"
              value={filters?.returnDateRange?.to || ''}
              onChange={(e) => handleDateRangeChange('returnDateRange', 'to', e.target.value)}
            />
          </div>
        </div>

        {/* Book Category */}
        <div>
          <Select
            label="Categoría de Libro"
            options={categoryOptions}
            value={filters?.category || ''}
            onChange={(value) => handleInputChange('category', value)}
            placeholder="Seleccionar categoría"
          />
        </div>

        {/* Active Filters Count */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                Filtros activos
              </span>
              <span className="text-sm font-medium text-primary">
                {Object.entries(filters || {}).filter(([key, value]) => {
                  if (typeof value === 'object' && value !== null) {
                    return Object.values(value).some(v => v !== '');
                  }
                  return value !== '';
                }).length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanFilters;
import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BookFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  isCollapsed,
  onToggleCollapse
}) => {
  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    { value: 'tecnología', label: 'Tecnología' },
    { value: 'ciencia', label: 'Ciencia' }
  ];

  const availabilityOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'available', label: 'Disponible' },
    { value: 'unavailable', label: 'No disponible' }
  ];

  const storageTypeOptions = [
    { value: '', label: 'Todos los tipos' },
    { value: 'físico', label: 'Físico' },
    { value: 'virtual', label: 'Virtual' }
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: '', label: 'Todos los años' },
    ...Array.from({ length: 50 }, (_, i) => {
      const year = currentYear - i;
      return { value: year.toString(), label: year.toString() };
    })
  ];

  const handleInputChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className={`bg-card border border-border rounded-lg shadow-soft transition-all duration-300 ${
      isCollapsed ? 'lg:w-12' : 'lg:w-80'
    }`}>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden p-4 border-b border-border">
        <Button
          variant="outline"
          onClick={onToggleCollapse}
          iconName={isCollapsed ? 'Filter' : 'X'}
          iconPosition="left"
          fullWidth
        >
          {isCollapsed ? 'Mostrar Filtros' : 'Ocultar Filtros'}
        </Button>
      </div>

      {/* Desktop Toggle Button */}
      <div className="hidden lg:block">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="absolute top-4 right-4 z-10"
          iconName={isCollapsed ? 'ChevronRight' : 'ChevronLeft'}
        />
      </div>

      {/* Filter Content */}
      <div className={`${isCollapsed ? 'hidden lg:hidden' : 'block'} p-4 space-y-4`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
            <Icon name="Filter" size={20} />
            <span>Filtros</span>
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            className="text-text-secondary hover:text-text-primary"
          >
            Limpiar
          </Button>
        </div>

        {/* Search Input */}
        <div>
          <Input
            label="Buscar libros"
            type="search"
            placeholder="ISBN, título, autor..."
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div>
          <Select
            label="Categoría"
            options={categoryOptions}
            value={filters.category}
            onChange={(value) => handleInputChange('category', value)}
          />
        </div>

        {/* Publication Year Filter */}
        <div>
          <Select
            label="Año de publicación"
            options={yearOptions}
            value={filters.publicationYear}
            onChange={(value) => handleInputChange('publicationYear', value)}
            searchable
          />
        </div>

        {/* Availability Filter */}
        <div>
          <Select
            label="Disponibilidad"
            options={availabilityOptions}
            value={filters.availability}
            onChange={(value) => handleInputChange('availability', value)}
          />
        </div>

        {/* Storage Type Filter */}
        <div>
          <Select
            label="Tipo de almacenamiento"
            options={storageTypeOptions}
            value={filters.storageType}
            onChange={(value) => handleInputChange('storageType', value)}
          />
        </div>

        {/* Active Filters Count */}
        {Object.values(filters).some(value => value !== '') && (
          <div className="pt-2 border-t border-border">
            <div className="text-sm text-text-secondary">
              Filtros activos: {Object.values(filters).filter(value => value !== '').length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookFilters;
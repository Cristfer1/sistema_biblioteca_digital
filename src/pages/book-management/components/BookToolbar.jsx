import React from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const BookToolbar = ({
  totalBooks,
  filteredBooks,
  selectedBooks = [],
  onAddBook,
  onBulkAction,
  onExport,
  loading = false
}) => {
  const bulkActionOptions = [
    { value: '', label: 'Acciones en lote' },
    { value: 'delete', label: 'Eliminar seleccionados' },
    { value: 'export', label: 'Exportar seleccionados' },
    { value: 'update-category', label: 'Cambiar categoría' }
  ];

  const handleBulkAction = (action) => {
    if (action && selectedBooks.length > 0) {
      onBulkAction(action, selectedBooks);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Section - Results Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="BookOpen" size={20} className="text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Gestión de Libros</h2>
              <p className="text-sm text-text-secondary">
                Mostrando {filteredBooks} de {totalBooks} libros
                {selectedBooks.length > 0 && (
                  <span className="ml-2 text-accent">
                    • {selectedBooks.length} seleccionado{selectedBooks.length !== 1 ? 's' : ''}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Bulk Actions */}
          {selectedBooks.length > 0 && (
            <div className="flex items-center space-x-2">
              <Select
                options={bulkActionOptions}
                value=""
                onChange={handleBulkAction}
                placeholder="Acciones en lote"
                className="min-w-[160px]"
              />
              <div className="text-sm text-text-secondary">
                {selectedBooks.length} elemento{selectedBooks.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}

          {/* Export Button */}
          <Button
            variant="outline"
            onClick={onExport}
            iconName="Download"
            iconPosition="left"
            disabled={loading || filteredBooks === 0}
            className="sm:w-auto"
          >
            Exportar
          </Button>

          {/* Add Book Button */}
          <Button
            variant="default"
            onClick={onAddBook}
            iconName="Plus"
            iconPosition="left"
            loading={loading}
            className="sm:w-auto"
          >
            Agregar Libro
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-semibold text-text-primary">{totalBooks}</div>
          <div className="text-xs text-text-secondary">Total de libros</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-success">{Math.floor(totalBooks * 0.75)}</div>
          <div className="text-xs text-text-secondary">Disponibles</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-warning">{Math.floor(totalBooks * 0.2)}</div>
          <div className="text-xs text-text-secondary">En préstamo</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-error">{Math.floor(totalBooks * 0.05)}</div>
          <div className="text-xs text-text-secondary">Vencidos</div>
        </div>
      </div>
    </div>
  );
};

export default BookToolbar;
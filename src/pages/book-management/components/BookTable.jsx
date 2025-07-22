import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BookTable = ({
  books,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  onViewDetails,
  loading
}) => {
  const getSortIcon = (column) => {
    if (sortConfig.key !== column) {
      return 'ArrowUpDown';
    }
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const handleSort = (column) => {
    const direction = 
      sortConfig.key === column && sortConfig.direction === 'asc' ?'desc' :'asc';
    onSort({ key: column, direction });
  };

  const getAvailabilityBadge = (available, total) => {
    const isAvailable = available > 0;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isAvailable 
          ? 'bg-success/10 text-success' :'bg-error/10 text-error'
      }`}>
        {available}/{total}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const colors = {
      'tecnología': 'bg-accent/10 text-accent',
      'ciencia': 'bg-primary/10 text-primary'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        colors[category] || 'bg-muted text-text-secondary'
      }`}>
        {category}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-soft">
        <div className="p-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-text-secondary">
            <Icon name="Loader2" size={20} className="animate-spin" />
            <span>Cargando libros...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('isbn')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-smooth"
                >
                  <span>ISBN</span>
                  <Icon name={getSortIcon('isbn')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-smooth"
                >
                  <span>Título</span>
                  <Icon name={getSortIcon('title')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('author')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-smooth"
                >
                  <span>Autor</span>
                  <Icon name={getSortIcon('author')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('type')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-smooth"
                >
                  <span>Tipo</span>
                  <Icon name={getSortIcon('type')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-smooth"
                >
                  <span>Categoría</span>
                  <Icon name={getSortIcon('category')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-sm font-medium text-text-primary">Disponibles</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-sm font-medium text-text-primary">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-muted/50 transition-smooth">
                <td className="px-4 py-3">
                  <div className="text-sm font-mono text-text-primary">{book.isbn}</div>
                  <div className="text-xs text-text-secondary">{book.code}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-text-primary">{book.title}</div>
                  <div className="text-xs text-text-secondary">Vol. {book.volume} • {book.publicationYear}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-text-primary">{book.author}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-text-primary capitalize">{book.type}</div>
                  <div className="text-xs text-text-secondary">{book.storageType}</div>
                </td>
                <td className="px-4 py-3">
                  {getCategoryBadge(book.category)}
                </td>
                <td className="px-4 py-3">
                  {getAvailabilityBadge(book.availableCopies, book.totalCopies)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(book)}
                      iconName="Eye"
                      className="text-text-secondary hover:text-primary"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(book)}
                      iconName="Edit"
                      className="text-text-secondary hover:text-accent"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(book)}
                      iconName="Trash2"
                      className="text-text-secondary hover:text-error"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden divide-y divide-border">
        {books.map((book) => (
          <div key={book.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-text-primary mb-1">{book.title}</h3>
                <p className="text-xs text-text-secondary">{book.author}</p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(book)}
                  iconName="Eye"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(book)}
                  iconName="Edit"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(book)}
                  iconName="Trash2"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-text-secondary">ISBN:</span>
                <span className="ml-1 font-mono text-text-primary">{book.isbn}</span>
              </div>
              <div>
                <span className="text-text-secondary">Código:</span>
                <span className="ml-1 font-mono text-text-primary">{book.code}</span>
              </div>
              <div>
                <span className="text-text-secondary">Tipo:</span>
                <span className="ml-1 text-text-primary capitalize">{book.type}</span>
              </div>
              <div>
                <span className="text-text-secondary">Año:</span>
                <span className="ml-1 text-text-primary">{book.publicationYear}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                {getCategoryBadge(book.category)}
                <span className="text-xs text-text-secondary">{book.storageType}</span>
              </div>
              {getAvailabilityBadge(book.availableCopies, book.totalCopies)}
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="BookOpen" size={48} className="mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No se encontraron libros</h3>
          <p className="text-text-secondary">Intenta ajustar los filtros o agregar nuevos libros al sistema.</p>
        </div>
      )}
    </div>
  );
};

export default BookTable;
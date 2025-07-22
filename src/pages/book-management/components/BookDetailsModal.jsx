import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BookDetailsModal = ({
  book,
  isOpen,
  onClose,
  onEdit
}) => {
  if (!isOpen || !book) return null;

  const getAvailabilityStatus = () => {
    const isAvailable = book.availableCopies > 0;
    return {
      text: isAvailable ? 'Disponible' : 'No disponible',
      color: isAvailable ? 'text-success' : 'text-error',
      bgColor: isAvailable ? 'bg-success/10' : 'bg-error/10'
    };
  };

  const getCategoryInfo = () => {
    const categoryMap = {
      'tecnología': {
        icon: 'Cpu',
        color: 'text-accent',
        bgColor: 'bg-accent/10'
      },
      'ciencia': {
        icon: 'Atom',
        color: 'text-primary',
        bgColor: 'bg-primary/10'
      }
    };
    return categoryMap[book.category] || categoryMap['tecnología'];
  };

  const getStorageTypeInfo = () => {
    return book.storageType === 'físico' 
      ? { icon: 'Package', label: 'Físico' }
      : { icon: 'Cloud', label: 'Virtual' };
  };

  const availabilityStatus = getAvailabilityStatus();
  const categoryInfo = getCategoryInfo();
  const storageInfo = getStorageTypeInfo();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryInfo.bgColor}`}>
              <Icon name={categoryInfo.icon} size={20} className={categoryInfo.color} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Detalles del Libro</h2>
              <p className="text-sm text-text-secondary">Información completa del registro</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(book)}
              iconName="Edit"
              iconPosition="left"
            >
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="X"
              className="text-text-secondary hover:text-text-primary"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Status and Availability */}
          <div className="flex items-center justify-between mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${availabilityStatus.bgColor} ${availabilityStatus.color}`}>
                <Icon name={book.availableCopies > 0 ? 'CheckCircle' : 'XCircle'} size={16} className="mr-1" />
                {availabilityStatus.text}
              </span>
              <span className="text-sm text-text-secondary">
                {book.availableCopies} de {book.totalCopies} copias disponibles
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-text-primary">{book.code}</div>
              <div className="text-xs text-text-secondary">Código del libro</div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-secondary">Título</label>
                <p className="text-base font-medium text-text-primary mt-1">{book.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Autor</label>
                <p className="text-base text-text-primary mt-1">{book.author}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">ISBN</label>
                <p className="text-base font-mono text-text-primary mt-1">{book.isbn}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-secondary">Tipo</label>
                <p className="text-base text-text-primary mt-1 capitalize">{book.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Categoría</label>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${categoryInfo.bgColor} ${categoryInfo.color}`}>
                    <Icon name={categoryInfo.icon} size={14} className="mr-1" />
                    {book.category}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Almacenamiento</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Icon name={storageInfo.icon} size={16} className="text-text-secondary" />
                  <span className="text-base text-text-primary">{storageInfo.label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Publication Details */}
          <div className="border-t border-border pt-6 mb-6">
            <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
              <Icon name="Calendar" size={18} className="mr-2" />
              Detalles de Publicación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-text-secondary">Año de publicación</label>
                <p className="text-base text-text-primary mt-1">{book.publicationYear}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Volumen</label>
                <p className="text-base text-text-primary mt-1">{book.volume}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Páginas</label>
                <p className="text-base text-text-primary mt-1">{book.pages}</p>
              </div>
            </div>
          </div>

          {/* Keywords */}
          {book.keywords && (
            <div className="border-t border-border pt-6 mb-6">
              <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
                <Icon name="Tags" size={18} className="mr-2" />
                Palabras Clave
              </h3>
              <div className="flex flex-wrap gap-2">
                {book.keywords.split(',').map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary/10 text-secondary"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Copy Information */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
              <Icon name="Copy" size={18} className="mr-2" />
              Información de Copias
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <div className="text-2xl font-bold text-text-primary">{book.totalCopies}</div>
                <div className="text-sm text-text-secondary">Total de copias</div>
              </div>
              <div className="p-4 bg-success/10 rounded-lg text-center">
                <div className="text-2xl font-bold text-success">{book.availableCopies}</div>
                <div className="text-sm text-text-secondary">Disponibles</div>
              </div>
              <div className="p-4 bg-warning/10 rounded-lg text-center">
                <div className="text-2xl font-bold text-warning">{book.totalCopies - book.availableCopies}</div>
                <div className="text-sm text-text-secondary">En préstamo</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-border bg-muted/50 space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cerrar
          </Button>
          <Button
            variant="default"
            onClick={() => onEdit(book)}
            iconName="Edit"
            iconPosition="left"
          >
            Editar Libro
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;
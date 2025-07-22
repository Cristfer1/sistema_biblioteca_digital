import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DeleteConfirmationModal = ({
  book,
  isOpen,
  onClose,
  onConfirm,
  loading = false
}) => {
  if (!isOpen || !book) return null;

  const hasActiveLoans = book.totalCopies - book.availableCopies > 0;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-md">
        {/* Header */}
        <div className="flex items-center space-x-3 p-6 border-b border-border">
          <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
            <Icon name="AlertTriangle" size={20} className="text-error" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Confirmar Eliminación</h2>
            <p className="text-sm text-text-secondary">Esta acción no se puede deshacer</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-text-primary mb-2">
              ¿Estás seguro de que deseas eliminar el siguiente libro?
            </p>
            
            {/* Book Info */}
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="BookOpen" size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-text-primary truncate">{book.title}</h3>
                  <p className="text-xs text-text-secondary">{book.author}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs font-mono text-text-secondary">{book.isbn}</span>
                    <span className="text-xs text-text-secondary">•</span>
                    <span className="text-xs font-mono text-text-secondary">{book.code}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Warning for Active Loans */}
          {hasActiveLoans && (
            <div className="mb-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="AlertCircle" size={16} className="text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-warning mb-1">Atención: Préstamos Activos</h4>
                  <p className="text-xs text-text-secondary">
                    Este libro tiene {book.totalCopies - book.availableCopies} copia(s) en préstamo activo. 
                    Al eliminarlo, también se eliminarán los registros de préstamo asociados.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Copy Information */}
          <div className="mb-4 p-3 bg-surface border border-border rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-text-primary">{book.totalCopies}</div>
                <div className="text-xs text-text-secondary">Total copias</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-error">{book.totalCopies - book.availableCopies}</div>
                <div className="text-xs text-text-secondary">En préstamo</div>
              </div>
            </div>
          </div>

          <div className="text-sm text-text-secondary">
            <p className="mb-2">Al confirmar la eliminación:</p>
            <ul className="list-disc list-inside space-y-1 text-xs ml-2">
              <li>Se eliminará permanentemente el libro del sistema</li>
              <li>Se eliminarán todos los registros de préstamo asociados</li>
              <li>Esta acción no se puede deshacer</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-border bg-muted/50 space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(book)}
            loading={loading}
            iconName="Trash2"
            iconPosition="left"
          >
            Eliminar Libro
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
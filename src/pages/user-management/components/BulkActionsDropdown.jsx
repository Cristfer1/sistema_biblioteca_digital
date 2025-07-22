import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionsDropdown = ({ selectedCount, onBulkAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action) => {
    onBulkAction(action);
    setIsOpen(false);
  };

  const bulkActions = [
    {
      id: 'activate',
      label: 'Activar usuarios',
      icon: 'UserCheck',
      description: 'Activar usuarios seleccionados'
    },
    {
      id: 'deactivate',
      label: 'Desactivar usuarios',
      icon: 'UserX',
      description: 'Desactivar usuarios seleccionados'
    },
    {
      id: 'changeToUser',
      label: 'Cambiar a Usuario',
      icon: 'User',
      description: 'Cambiar rol a Usuario'
    },
    {
      id: 'changeToAdmin',
      label: 'Cambiar a Admin',
      icon: 'Shield',
      description: 'Cambiar rol a Administrador'
    },
    {
      id: 'export',
      label: 'Exportar seleccionados',
      icon: 'Download',
      description: 'Exportar datos de usuarios seleccionados'
    }
  ];

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        iconName="MoreVertical"
        iconPosition="right"
      >
        Acciones masivas ({selectedCount})
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-popover border border-border rounded-md shadow-elevated z-50">
          <div className="p-2">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-medium text-popover-foreground">
                {selectedCount} usuario{selectedCount !== 1 ? 's' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="py-1">
              {bulkActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.id)}
                  className="flex items-start space-x-3 w-full px-3 py-2 text-left hover:bg-muted rounded-sm transition-smooth"
                >
                  <Icon name={action.icon} size={16} className="mt-0.5 text-text-secondary" />
                  <div>
                    <div className="text-sm font-medium text-popover-foreground">
                      {action.label}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {action.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActionsDropdown;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActionCard = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Agregar Libro',
      description: 'Registrar nuevo libro en el sistema',
      icon: 'BookPlus',
      color: 'primary',
      action: () => navigate('/book-management')
    },
    {
      title: 'Nuevo Usuario',
      description: 'Crear cuenta de usuario',
      icon: 'UserPlus',
      color: 'success',
      action: () => navigate('/user-management')
    },
    {
      title: 'Procesar Préstamo',
      description: 'Registrar nuevo préstamo',
      icon: 'FileText',
      color: 'warning',
      action: () => navigate('/loan-management')
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-center mb-6">
        <Icon name="Zap" size={20} className="text-primary mr-2" />
        <h3 className="text-lg font-semibold text-text-primary">Acciones Rápidas</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <div key={index} className="p-4 border border-border rounded-lg hover:bg-muted transition-smooth">
            <div className="flex items-center mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                action.color === 'primary' ? 'bg-primary text-primary-foreground' :
                action.color === 'success' ? 'bg-success text-success-foreground' :
                'bg-warning text-warning-foreground'
              }`}>
                <Icon name={action.icon} size={20} />
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-text-primary">{action.title}</h4>
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-4">{action.description}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={action.action}
              className="w-full"
            >
              Ir a {action.title}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionCard;
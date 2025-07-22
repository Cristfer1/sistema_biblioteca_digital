import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationPanel = () => {
  const notifications = [
    {
      id: 1,
      type: 'overdue',
      title: 'Préstamos Vencidos',
      message: '3 préstamos han superado la fecha de devolución',
      count: 3,
      priority: 'high',
      action: 'Ver préstamos'
    },
    {
      id: 2,
      type: 'inventory',
      title: 'Inventario Bajo',
      message: '5 libros tienen menos de 2 copias disponibles',
      count: 5,
      priority: 'medium',
      action: 'Revisar inventario'
    },
    {
      id: 3,
      type: 'system',
      title: 'Actualización Disponible',
      message: 'Nueva versión del sistema disponible para instalación',
      count: 1,
      priority: 'low',
      action: 'Ver detalles'
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'overdue': return 'AlertTriangle';
      case 'inventory': return 'Package';
      case 'system': return 'Settings';
      default: return 'Bell';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-error bg-error/5';
      case 'medium': return 'border-l-warning bg-warning/5';
      case 'low': return 'border-l-primary bg-primary/5';
      default: return 'border-l-border bg-muted';
    }
  };

  const getIconColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-primary';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Icon name="Bell" size={20} className="text-primary mr-2" />
          <h3 className="text-lg font-semibold text-text-primary">Notificaciones</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-error text-error-foreground px-2 py-1 rounded-full">
            {notifications.filter(n => n.priority === 'high').length}
          </span>
          <button className="text-sm text-primary hover:text-primary/80 transition-smooth">
            Ver todas
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`border-l-4 p-4 rounded-r-lg ${getPriorityColor(notification.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <Icon 
                    name={getNotificationIcon(notification.type)} 
                    size={18} 
                    className={getIconColor(notification.priority)} 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-text-primary">{notification.title}</h4>
                    <span className="text-xs bg-muted text-text-secondary px-2 py-1 rounded-full">
                      {notification.count}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">{notification.message}</p>
                  <Button variant="outline" size="sm">
                    {notification.action}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
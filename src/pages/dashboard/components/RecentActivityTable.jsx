import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivityTable = () => {
  const recentActivities = [
    {
      id: 1,
      type: 'loan',
      description: 'Préstamo registrado: "Inteligencia Artificial"',
      user: 'María González',
      timestamp: '2025-01-22 09:30',
      status: 'completed'
    },
    {
      id: 2,
      type: 'return',
      description: 'Devolución: "Bases de Datos Avanzadas"',
      user: 'Carlos Rodríguez',
      timestamp: '2025-01-22 08:45',
      status: 'completed'
    },
    {
      id: 3,
      type: 'user',
      description: 'Nuevo usuario registrado',
      user: 'Ana Martínez',
      timestamp: '2025-01-22 08:15',
      status: 'completed'
    },
    {
      id: 4,
      type: 'book',
      description: 'Libro agregado: "Redes Neuronales"',
      user: 'Admin Sistema',
      timestamp: '2025-01-21 16:20',
      status: 'completed'
    },
    {
      id: 5,
      type: 'overdue',
      description: 'Préstamo vencido: "Algoritmos y Estructuras"',
      user: 'Pedro López',
      timestamp: '2025-01-21 15:00',
      status: 'overdue'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'loan': return 'FileText';
      case 'return': return 'RotateCcw';
      case 'user': return 'UserPlus';
      case 'book': return 'BookPlus';
      case 'overdue': return 'AlertTriangle';
      default: return 'Activity';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'overdue': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Icon name="Activity" size={20} className="text-primary mr-2" />
          <h3 className="text-lg font-semibold text-text-primary">Actividad Reciente</h3>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 transition-smooth">
          Ver todo
        </button>
      </div>

      <div className="space-y-4">
        {recentActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted transition-smooth">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Icon name={getActivityIcon(activity.type)} size={16} className="text-text-secondary" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {activity.description}
              </p>
              <div className="flex items-center mt-1 space-x-2">
                <span className="text-xs text-text-secondary">{activity.user}</span>
                <span className="text-xs text-text-secondary">•</span>
                <span className="text-xs text-text-secondary">{activity.timestamp}</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Icon 
                name={activity.status === 'completed' ? 'CheckCircle' : 'AlertCircle'} 
                size={16} 
                className={getStatusColor(activity.status)} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityTable;
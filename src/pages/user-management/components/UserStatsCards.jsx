import React from 'react';
import Icon from '../../../components/AppIcon';

const UserStatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Usuarios',
      value: stats.totalUsers,
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Administradores',
      value: stats.adminUsers,
      icon: 'Shield',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Usuarios Activos',
      value: stats.activeUsers,
      icon: 'UserCheck',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Préstamos Activos',
      value: stats.activeLoans,
      icon: 'BookOpen',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary font-medium">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {card.value.toLocaleString()}
              </p>
            </div>
            <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={card.icon} size={24} className={card.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStatsCards;
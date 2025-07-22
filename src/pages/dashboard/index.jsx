import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import MetricCard from './components/MetricCard';
import QuickActionCard from './components/QuickActionCard';
import RecentActivityTable from './components/RecentActivityTable';
import ChartCard from './components/ChartCard';
import NotificationPanel from './components/NotificationPanel';
import Icon from '../../components/AppIcon';

const Dashboard = () => {
  const [user, setUser] = useState({
    name: 'Administrador Sistema',
    email: 'admin@biblioteca.com',
    role: 'Administrador'
  });

  // Mock data for metrics
  const metrics = [
    {
      title: 'Total Libros',
      value: '1,247',
      icon: 'Book',
      trend: 'up',
      trendValue: '+12 este mes',
      color: 'primary'
    },
    {
      title: 'Préstamos Activos',
      value: '89',
      icon: 'FileText',
      trend: 'up',
      trendValue: '+5 hoy',
      color: 'success'
    },
    {
      title: 'Préstamos Vencidos',
      value: '3',
      icon: 'AlertTriangle',
      trend: 'down',
      trendValue: '-2 desde ayer',
      color: 'error'
    },
    {
      title: 'Usuarios Registrados',
      value: '456',
      icon: 'Users',
      trend: 'up',
      trendValue: '+8 esta semana',
      color: 'secondary'
    }
  ];

  // Mock data for loan trends chart
  const loanTrendsData = [
    { name: 'Ene', value: 45 },
    { name: 'Feb', value: 52 },
    { name: 'Mar', value: 48 },
    { name: 'Apr', value: 61 },
    { name: 'May', value: 55 },
    { name: 'Jun', value: 67 },
    { name: 'Jul', value: 73 }
  ];

  // Mock data for popular categories chart
  const categoriesData = [
    { name: 'Tecnología', value: 45 },
    { name: 'Ciencia', value: 32 },
    { name: 'Literatura', value: 28 },
    { name: 'Historia', value: 15 },
    { name: 'Otros', value: 12 }
  ];

  // Mock data for inventory status
  const inventoryData = [
    { name: 'Disponible', value: 892 },
    { name: 'Prestado', value: 289 },
    { name: 'Mantenimiento', value: 45 },
    { name: 'Perdido', value: 21 }
  ];

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
  };

  useEffect(() => {
    // Simulate loading user data
    const loadUserData = () => {
      // In a real app, this would fetch from an API
      setUser({
        name: 'Administrador Sistema',
        email: 'admin@biblioteca.com',
        role: 'Administrador'
      });
    };

    loadUserData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Icon name="LayoutDashboard" size={28} className="text-primary" />
              <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
            </div>
            <p className="text-text-secondary">
              Bienvenido al Sistema de Gestión de Biblioteca Digital - {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
                trend={metric.trend}
                trendValue={metric.trendValue}
                color={metric.color}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-8 mb-8">
            {/* Left Section - Priority Actions and Recent Activity */}
            <div className="lg:col-span-5 space-y-8">
              <QuickActionCard />
              <RecentActivityTable />
            </div>

            {/* Right Section - Charts */}
            <div className="lg:col-span-3 space-y-8">
              <ChartCard
                title="Tendencia de Préstamos"
                type="bar"
                data={loanTrendsData}
                icon="TrendingUp"
              />
              <ChartCard
                title="Categorías Populares"
                type="pie"
                data={categoriesData}
                icon="PieChart"
              />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Notifications Panel */}
            <NotificationPanel />
            
            {/* Inventory Status Chart */}
            <ChartCard
              title="Estado del Inventario"
              type="pie"
              data={inventoryData}
              icon="Package"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
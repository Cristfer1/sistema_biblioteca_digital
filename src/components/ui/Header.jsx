import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, userProfile } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Use auth context data if available, fallback to props
  const currentUser = userProfile || user;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login-screen');
    } catch (error) {
      console.log('Logout error:', error);
      // Fallback to prop-based logout if context fails
      if (onLogout) {
        onLogout();
      }
    }
  };

  // Navigation items
  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard'
    },
    {
      path: '/book-management',
      label: 'Libros',
      icon: 'Book'
    },
    {
      path: '/loan-management',
      label: 'Préstamos',
      icon: 'Calendar'
    },
    {
      path: '/user-management',
      label: 'Usuarios',
      icon: 'Users'
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="BookOpen" size={20} className="text-white" />
              </div>
              <span className="font-bold text-text-primary text-lg">Biblioteca Digital</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-background'
                  }`}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Icon name="Bell" size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-background transition-colors"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} className="text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-text-primary">
                    {currentUser?.full_name || currentUser?.name || 'Usuario'}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {currentUser?.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </p>
                </div>
                <Icon name="ChevronDown" size={16} className="text-text-secondary" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-border z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-text-primary">
                        {currentUser?.full_name || currentUser?.name || 'Usuario'}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {currentUser?.email || 'email@ejemplo.com'}
                      </p>
                    </div>
                    
                    <button className="flex items-center space-x-3 w-full px-4 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-background">
                      <Icon name="User" size={16} />
                      <span>Perfil</span>
                    </button>
                    
                    <button className="flex items-center space-x-3 w-full px-4 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-background">
                      <Icon name="Settings" size={16} />
                      <span>Configuración</span>
                    </button>
                    
                    <hr className="my-2" />
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-left text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border">
        <div className="flex overflow-x-auto px-4 py-2 space-x-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-background'
                }`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;
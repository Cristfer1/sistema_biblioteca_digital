import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import UserFilters from './components/UserFilters';
import UserTable from './components/UserTable';
import UserModal from './components/UserModal';
import BulkActionsDropdown from './components/BulkActionsDropdown';
import UserStatsCards from './components/UserStatsCards';
import Icon from '../../components/AppIcon';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'registrationDate',
    direction: 'desc'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data
  const mockUsers = [
    {
      id: 'user_1',
      userId: 'ADMIN-001',
      name: 'María González',
      email: 'maria.gonzalez@biblioteca.com',
      role: 'admin',
      status: 'active',
      registrationDate: '2024-01-15T10:30:00Z',
      activeLoans: 2
    },
    {
      id: 'user_2',
      userId: 'USER-001',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      role: 'user',
      status: 'active',
      registrationDate: '2024-02-20T14:15:00Z',
      activeLoans: 1
    },
    {
      id: 'user_3',
      userId: 'USER-002',
      name: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      role: 'user',
      status: 'active',
      registrationDate: '2024-03-10T09:45:00Z',
      activeLoans: 3
    },
    {
      id: 'user_4',
      userId: 'ADMIN-002',
      name: 'Luis Fernández',
      email: 'luis.fernandez@biblioteca.com',
      role: 'admin',
      status: 'active',
      registrationDate: '2024-01-25T16:20:00Z',
      activeLoans: 0
    },
    {
      id: 'user_5',
      userId: 'USER-003',
      name: 'Carmen López',
      email: 'carmen.lopez@email.com',
      role: 'user',
      status: 'inactive',
      registrationDate: '2024-04-05T11:30:00Z',
      activeLoans: 0
    },
    {
      id: 'user_6',
      userId: 'USER-004',
      name: 'Pedro Sánchez',
      email: 'pedro.sanchez@email.com',
      role: 'user',
      status: 'active',
      registrationDate: '2024-05-12T13:45:00Z',
      activeLoans: 2
    },
    {
      id: 'user_7',
      userId: 'USER-005',
      name: 'Isabel Ruiz',
      email: 'isabel.ruiz@email.com',
      role: 'user',
      status: 'active',
      registrationDate: '2024-06-18T08:15:00Z',
      activeLoans: 1
    },
    {
      id: 'user_8',
      userId: 'USER-006',
      name: 'Miguel Torres',
      email: 'miguel.torres@email.com',
      role: 'user',
      status: 'active',
      registrationDate: '2024-07-01T15:30:00Z',
      activeLoans: 0
    }
  ];

  // Mock user for authentication
  const mockAuthUser = {
    name: 'Administrador',
    email: 'admin@biblioteca.com',
    role: 'admin'
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filters, sortConfig]);

  const applyFilters = () => {
    let filtered = [...users];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.userId.toLowerCase().includes(searchLower)
      );
    }

    // Role filter
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(user => 
        new Date(user.registrationDate) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(user => 
        new Date(user.registrationDate) <= new Date(filters.dateTo)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === 'registrationDate') {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
      }

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredUsers(filtered);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      role: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (userData) => {
    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id ? { ...user, ...userData } : user
      ));
    } else {
      // Create new user
      const newUser = {
        ...userData,
        id: `user_${Date.now()}`,
        userId: generateUserId(userData.role),
        registrationDate: new Date().toISOString(),
        activeLoans: 0
      };
      setUsers(prev => [...prev, newUser]);
    }
  };

  const generateUserId = (role) => {
    const prefix = role === 'admin' ? 'ADMIN' : 'USER';
    const existingIds = users
      .filter(user => user.userId.startsWith(prefix))
      .map(user => parseInt(user.userId.split('-')[1]))
      .filter(num => !isNaN(num));
    
    const nextNumber = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    return `${prefix}-${nextNumber.toString().padStart(3, '0')}`;
  };

  const handleViewHistory = (userId) => {
    navigate('/loan-management', { state: { userId } });
  };

  const handleChangeRole = (userId) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        return {
          ...user,
          role: newRole,
          userId: generateUserId(newRole)
        };
      }
      return user;
    }));
  };

  const handleToggleStatus = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleBulkAction = (action) => {
    // Implementation for bulk actions
    console.log('Bulk action:', action, 'for users:', selectedUsers);
  };

  const handleExport = () => {
    // Implementation for export functionality
    console.log('Exporting users...');
  };

  const handleLogout = () => {
    navigate('/login-screen');
  };

  // Calculate stats
  const stats = {
    totalUsers: users.length,
    adminUsers: users.filter(user => user.role === 'admin').length,
    activeUsers: users.filter(user => user.status === 'active').length,
    activeLoans: users.reduce((sum, user) => sum + user.activeLoans, 0)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={mockAuthUser} onLogout={handleLogout} />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="flex items-center space-x-3">
            <Icon name="Loader2" size={24} className="animate-spin text-primary" />
            <span className="text-text-secondary">Cargando usuarios...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockAuthUser} onLogout={handleLogout} />
      
      <div className="pt-16">
        <div className="p-4 lg:p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Gestión de Usuarios
            </h1>
            <p className="text-text-secondary">
              Administra las cuentas de usuarios y permisos del sistema
            </p>
          </div>

          {/* Stats Cards */}
          <UserStatsCards stats={stats} />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-3">
              <UserFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={handleCreateUser}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Crear Usuario
                  </Button>
                  <BulkActionsDropdown
                    selectedCount={selectedUsers.length}
                    onBulkAction={handleBulkAction}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleExport}
                    iconName="Download"
                    iconPosition="left"
                  >
                    Exportar
                  </Button>
                </div>
              </div>

              {/* Results Summary */}
              <div className="mb-4">
                <p className="text-sm text-text-secondary">
                  Mostrando {filteredUsers.length} de {users.length} usuarios
                </p>
              </div>

              {/* Users Table */}
              <UserTable
                users={filteredUsers}
                onEdit={handleEditUser}
                onViewHistory={handleViewHistory}
                onChangeRole={handleChangeRole}
                onToggleStatus={handleToggleStatus}
                onSort={handleSort}
                sortConfig={sortConfig}
              />
            </div>
          </div>
        </div>
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editingUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UserManagement;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserTable = ({ users, onEdit, onViewHistory, onChangeRole, onToggleStatus, onSort, sortConfig }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    if (status === 'active') {
      return `${baseClasses} bg-success/10 text-success`;
    }
    return `${baseClasses} bg-error/10 text-error`;
  };

  const getRoleBadge = (role) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    if (role === 'admin') {
      return `${baseClasses} bg-primary/10 text-primary`;
    }
    return `${baseClasses} bg-secondary/10 text-secondary`;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => onSort('userId')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary"
                >
                  <span>ID Usuario</span>
                  <Icon name={getSortIcon('userId')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => onSort('name')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary"
                >
                  <span>Nombre</span>
                  <Icon name={getSortIcon('name')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => onSort('email')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary"
                >
                  <span>Email</span>
                  <Icon name={getSortIcon('email')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => onSort('role')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary"
                >
                  <span>Rol</span>
                  <Icon name={getSortIcon('role')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => onSort('registrationDate')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary"
                >
                  <span>Fecha Registro</span>
                  <Icon name={getSortIcon('registrationDate')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-text-primary">Préstamos Activos</span>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-text-primary">Estado</span>
              </th>
              <th className="text-center p-4">
                <span className="text-sm font-medium text-text-primary">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-4">
                  <span className="font-mono text-sm text-text-primary">{user.userId}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="white" />
                    </div>
                    <span className="font-medium text-text-primary">{user.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-text-secondary">{user.email}</span>
                </td>
                <td className="p-4">
                  <span className={getRoleBadge(user.role)}>
                    {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-text-secondary">{formatDate(user.registrationDate)}</span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onViewHistory(user.id)}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    {user.activeLoans}
                  </button>
                </td>
                <td className="p-4">
                  <span className={getStatusBadge(user.status)}>
                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(user)}
                      iconName="Edit"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewHistory(user.id)}
                      iconName="FileText"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onChangeRole(user.id)}
                      iconName="Shield"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(user.id)}
                      iconName={user.status === 'active' ? 'UserX' : 'UserCheck'}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {users.map((user) => (
          <div key={user.id} className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                  className="rounded border-border"
                />
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={18} color="white" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">{user.name}</h3>
                  <p className="text-sm text-text-secondary font-mono">{user.userId}</p>
                </div>
              </div>
              <span className={getStatusBadge(user.status)}>
                {user.status === 'active' ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Email:</span>
                <span className="text-sm text-text-primary">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Rol:</span>
                <span className={getRoleBadge(user.role)}>
                  {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Registro:</span>
                <span className="text-sm text-text-primary">{formatDate(user.registrationDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Préstamos activos:</span>
                <button
                  onClick={() => onViewHistory(user.id)}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  {user.activeLoans}
                </button>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(user)}
                iconName="Edit"
                iconPosition="left"
              >
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewHistory(user.id)}
                iconName="FileText"
                iconPosition="left"
              >
                Historial
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleStatus(user.id)}
                iconName={user.status === 'active' ? 'UserX' : 'UserCheck'}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTable;
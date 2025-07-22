import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: 'user', label: 'Usuario' },
    { value: 'admin', label: 'Administrador' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' }
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        status: user.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'user',
        status: 'active'
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const userData = {
        ...formData,
        id: user?.id || `user_${Date.now()}`,
        userId: user?.userId || generateUserId(formData.role),
        registrationDate: user?.registrationDate || new Date().toISOString(),
        activeLoans: user?.activeLoans || 0
      };

      await onSave(userData);
      onClose();
    } catch (error) {
      setErrors({ submit: 'Error al guardar el usuario. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const generateUserId = (role) => {
    const prefix = role === 'admin' ? 'ADMIN' : 'USER';
    const number = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${number}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">
            {user ? 'Editar Usuario' : 'Crear Usuario'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <Input
            label="Nombre completo"
            type="text"
            placeholder="Ingresa el nombre completo"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            required
          />

          {/* Email */}
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="usuario@ejemplo.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            required
          />

          {/* Role */}
          <Select
            label="Rol"
            options={roleOptions}
            value={formData.role}
            onChange={(value) => handleInputChange('role', value)}
            description="Define los permisos del usuario en el sistema"
          />

          {/* Status */}
          <Select
            label="Estado"
            options={statusOptions}
            value={formData.status}
            onChange={(value) => handleInputChange('status', value)}
          />

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-md">
              <p className="text-sm text-error">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              fullWidth
            >
              {user ? 'Actualizar' : 'Crear'} Usuario
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
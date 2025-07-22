import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials for different user types
  const mockCredentials = [
    {
      email: "admin@biblioteca.com",
      password: "admin123",
      role: "admin",
      name: "María González",
      id: "ADMIN-001"
    },
    {
      email: "bibliotecario@biblioteca.com", 
      password: "biblio123",
      role: "librarian",
      name: "Carlos Rodríguez",
      id: "USER-001"
    },
    {
      email: "usuario@biblioteca.com",
      password: "user123", 
      role: "user",
      name: "Ana Martínez",
      id: "USER-002"
    }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de correo electrónico inválido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check credentials
      const user = mockCredentials.find(
        cred => cred.email === formData.email && cred.password === formData.password
      );

      if (user) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        if (onLogin) {
          onLogin(user);
        }
        
        navigate('/dashboard');
      } else {
        setErrors({
          general: 'Credenciales inválidas. Verifique su correo y contraseña.\n\nCredenciales de prueba:\n• admin@biblioteca.com / admin123\n• bibliotecario@biblioteca.com / biblio123\n• usuario@biblioteca.com / user123'
        });
      }
    } catch (error) {
      setErrors({
        general: 'Error del sistema. Intente nuevamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Funcionalidad de recuperación de contraseña no implementada en esta demo.\n\nUse las credenciales de prueba proporcionadas.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start">
            <Icon name="AlertCircle" size={20} className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-red-700 whitespace-pre-line">
              {errors.general}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Correo Electrónico"
          type="email"
          name="email"
          placeholder="Ingrese su correo electrónico"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          required
          disabled={isLoading}
        />

        <Input
          label="Contraseña"
          type="password"
          name="password"
          placeholder="Ingrese su contraseña"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          required
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        iconName="LogIn"
        iconPosition="left"
      >
        {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm text-primary hover:text-primary/80 transition-smooth"
          disabled={isLoading}
        >
          ¿Olvidó su contraseña?
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
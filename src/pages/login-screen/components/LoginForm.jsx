import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn, authError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear auth error when user starts typing
    if (authError) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    setLoading(true);
    
    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result?.success) {
        navigate('/dashboard');
      }
      // Error handling is managed by AuthContext
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials helper
  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@biblioteca.com',
        password: 'admin123'
      });
    } else {
      setFormData({
        email: 'carlos.rodriguez@email.com',
        password: 'user123'
      });
    }
    clearError();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Demo Credentials Helper */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-medium text-blue-800 mb-3">Credenciales de Prueba:</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fillDemoCredentials('admin')}
            className="text-xs"
          >
            Admin: admin@biblioteca.com
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fillDemoCredentials('user')}
            className="text-xs"
          >
            Usuario: carlos.rodriguez@email.com
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {authError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{authError}</p>
            </div>
            <button
              type="button"
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
          Correo Electrónico
        </label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="tu.email@ejemplo.com"
          required
          disabled={loading}
          className="w-full"
        />
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
          Contraseña
        </label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Tu contraseña"
            required
            disabled={loading}
            className="w-full pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            disabled={loading}
          >
            <Icon 
              name={showPassword ? "EyeOff" : "Eye"} 
              size={20} 
              className="text-text-secondary hover:text-text-primary"
            />
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-text-secondary">
            Recordarme
          </label>
        </div>
        
        <button
          type="button"
          className="text-sm text-primary hover:text-primary-dark"
          disabled={loading}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={loading || !formData.email || !formData.password}
        iconName={loading ? "Loader2" : "LogIn"}
        iconPosition="left"
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>

      {/* Additional Info */}
      <div className="text-center">
        <p className="text-sm text-text-secondary">
          Sistema de Biblioteca Digital v1.0
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
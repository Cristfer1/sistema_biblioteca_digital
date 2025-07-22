import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import LoginCard from './components/LoginCard';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (isAuthenticated === 'true' && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        navigate('/dashboard');
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
      
      {/* Login Container */}
      <div className="relative z-10 w-full">
        <LoginCard>
          <LoginHeader />
          <LoginForm onLogin={handleLogin} />
        </LoginCard>
        
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} Sistema Biblioteca Digital. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
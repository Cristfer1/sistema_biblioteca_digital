import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const RouteProtection = ({ 
  children, 
  requiredRole = null, 
  user = null,
  isAuthenticated = false,
  onAuthCheck 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      setIsLoading(true);

      // Perform authentication check if callback provided
      if (onAuthCheck) {
        try {
          await onAuthCheck();
        } catch (error) {
          console.error('Authentication check failed:', error);
          navigate('/login-screen', { 
            replace: true, 
            state: { from: location.pathname } 
          });
          return;
        }
      }

      // Check if user is authenticated
      if (!isAuthenticated) {
        navigate('/login-screen', { 
          replace: true, 
          state: { from: location.pathname } 
        });
        return;
      }

      // Check role-based access if required
      if (requiredRole && user?.role !== requiredRole) {
        // Redirect to dashboard if user doesn't have required role navigate('/dashboard', { replace: true });
        return;
      }

      setHasAccess(true);
      setIsLoading(false);
    };

    checkAccess();
  }, [isAuthenticated, user, requiredRole, navigate, location.pathname, onAuthCheck]);

  if (isLoading) {
    return (
      <LoadingSpinner 
        overlay 
        size="lg" 
        text="Verificando acceso..." 
      />
    );
  }

  if (!hasAccess) {
    return null;
  }

  return children;
};

export default RouteProtection;
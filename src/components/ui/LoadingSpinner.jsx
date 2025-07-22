import React from 'react';
import Icon from '../AppIcon';

const LoadingSpinner = ({ 
  size = 'default', 
  text = 'Cargando...', 
  overlay = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    default: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin text-primary`}>
        <Icon name="Loader2" size={size === 'sm' ? 16 : size === 'lg' ? 32 : size === 'xl' ? 48 : 24} />
      </div>
      {text && (
        <div className={`${textSizeClasses[size]} text-text-secondary font-medium`}>
          {text}
        </div>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;
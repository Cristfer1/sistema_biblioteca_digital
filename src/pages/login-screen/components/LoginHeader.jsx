import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-elevated">
          <Icon name="BookOpen" size={32} color="white" />
        </div>
      </div>

      {/* Title and Subtitle */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-text-primary">
          Sistema de Gestión de Biblioteca
        </h1>
        <p className="text-text-secondary text-sm">
          Acceda a su cuenta para gestionar la biblioteca digital
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;
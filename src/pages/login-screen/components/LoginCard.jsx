import React from 'react';

const LoginCard = ({ children }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg shadow-elevated p-8">
        {children}
      </div>
    </div>
  );
};

export default LoginCard;
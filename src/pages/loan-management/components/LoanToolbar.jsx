import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LoanToolbar = ({ 
  totalLoans, 
  filteredLoans, 
  overdueCount, 
  onCreateLoan, 
  onBulkReturn 
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Section - Stats */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">Total:</span>
            <span className="font-semibold text-text-primary">{totalLoans}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">Filtrados:</span>
            <span className="font-semibold text-text-primary">{filteredLoans}</span>
          </div>

          {overdueCount > 0 && (
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <span className="text-sm text-error">Vencidos:</span>
              <span className="font-semibold text-error">{overdueCount}</span>
            </div>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {overdueCount > 0 && (
            <div className="bg-error/10 text-error px-3 py-2 rounded-lg border border-error/20">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={14} />
                <span className="text-sm font-medium">
                  {overdueCount} préstamo{overdueCount > 1 ? 's' : ''} vencido{overdueCount > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkReturn([])}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Devolución Masiva
          </Button>

          <Button
            onClick={onCreateLoan}
            iconName="Plus"
            iconPosition="left"
          >
            Nuevo Préstamo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoanToolbar;
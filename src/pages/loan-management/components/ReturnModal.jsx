import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ReturnModal = ({
  loan,
  isOpen,
  onClose,
  onConfirm,
  loading
}) => {
  const [returnData, setReturnData] = useState({
    returnDate: '',
    lateFee: 0,
    condition: 'good',
    notes: ''
  });

  const today = new Date().toISOString().split('T')[0];

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen && loan) {
      const calculatedLateFee = calculateLateFee(loan);
      setReturnData({
        returnDate: today,
        lateFee: calculatedLateFee,
        condition: 'good',
        notes: ''
      });
    }
  }, [isOpen, loan, today]);

  const calculateLateFee = (loanData) => {
    if (!loanData?.dueDate) return 0;
    
    const dueDate = new Date(loanData.dueDate);
    const returnDate = new Date(today);
    const diffTime = returnDate - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Late fee: $2.50 per day overdue (minimum 0)
    return diffDays > 0 ? diffDays * 2.5 : 0;
  };

  const handleInputChange = (field, value) => {
    setReturnData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Recalculate late fee when return date changes
      if (field === 'returnDate' && loan) {
        const dueDate = new Date(loan.dueDate);
        const returnDate = new Date(value);
        const diffTime = returnDate - dueDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        updated.lateFee = diffDays > 0 ? diffDays * 2.5 : 0;
      }
      
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!returnData.returnDate) return;
    
    onConfirm(returnData);
  };

  const isOverdue = loan?.dueDate && new Date(returnData.returnDate) > new Date(loan.dueDate);
  const daysLate = isOverdue ? 
    Math.ceil((new Date(returnData.returnDate) - new Date(loan.dueDate)) / (1000 * 60 * 60 * 24)) : 0;

  if (!isOpen || !loan) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="RotateCcw" size={20} className="text-primary" />
            <h2 className="text-xl font-semibold text-text-primary">
              Procesar Devolución
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            disabled={loading}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Loan Information */}
          <div className="bg-muted p-4 rounded-lg mb-6">
            <h3 className="font-medium text-text-primary mb-3">
              Información del Préstamo
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">ID Préstamo:</span>
                <span className="text-text-primary font-mono">{loan?.loanId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Usuario:</span>
                <span className="text-text-primary">{loan?.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Libro:</span>
                <span className="text-text-primary">{loan?.bookTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Fecha préstamo:</span>
                <span className="text-text-primary">
                  {new Date(loan?.loanDate).toLocaleDateString('es-ES')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Fecha vencimiento:</span>
                <span className={`${loan?.status === 'overdue' ? 'text-error font-medium' : 'text-text-primary'}`}>
                  {new Date(loan?.dueDate).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Return Date */}
            <Input
              type="date"
              label="Fecha de Devolución"
              required
              value={returnData.returnDate}
              onChange={(e) => handleInputChange('returnDate', e.target.value)}
              max={today}
            />

            {/* Late Fee Calculation */}
            {isOverdue && (
              <div className="bg-error/10 border border-error/20 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="AlertCircle" size={16} className="text-error" />
                  <h4 className="font-medium text-error">Devolución Tardía</h4>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Días de retraso:</span>
                    <span className="font-medium text-error">{daysLate} días</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Tarifa por día:</span>
                    <span className="text-text-primary">$2.50</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-text-primary">Multa total:</span>
                    <span className="text-error">${returnData.lateFee.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Manual Late Fee Adjustment */}
            <Input
              type="number"
              step="0.01"
              min="0"
              label="Multa por Retraso"
              value={returnData.lateFee}
              onChange={(e) => handleInputChange('lateFee', parseFloat(e.target.value) || 0)}
              description={`Calculado automáticamente: $${calculateLateFee(loan).toFixed(2)}`}
            />

            {/* Book Condition */}
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                Condición del Libro
              </label>
              <div className="space-y-2">
                {[
                  { value: 'excellent', label: 'Excelente', icon: 'Star' },
                  { value: 'good', label: 'Buena', icon: 'Check' },
                  { value: 'fair', label: 'Regular', icon: 'AlertCircle' },
                  { value: 'damaged', label: 'Dañado', icon: 'AlertTriangle' }
                ].map((condition) => (
                  <label key={condition.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="condition"
                      value={condition.value}
                      checked={returnData.condition === condition.value}
                      onChange={(e) => handleInputChange('condition', e.target.value)}
                      className="rounded border-border"
                    />
                    <Icon name={condition.icon} size={16} className={
                      returnData.condition === condition.value ? 'text-primary' : 'text-text-secondary'
                    } />
                    <span className={`text-sm ${
                      returnData.condition === condition.value ? 'text-text-primary font-medium' : 'text-text-secondary'
                    }`}>
                      {condition.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                Notas Adicionales
              </label>
              <textarea
                value={returnData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Notas sobre la condición del libro, incidencias, etc..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            {/* Return Summary */}
            <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
              <h4 className="font-medium text-success mb-2">Resumen de Devolución</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Estado:</span>
                  <span className="text-success font-medium">
                    {isOverdue ? 'Devuelto con retraso' : 'Devuelto a tiempo'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Condición:</span>
                  <span className="text-text-primary capitalize">{returnData.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Multa:</span>
                  <span className={`font-medium ${returnData.lateFee > 0 ? 'text-error' : 'text-success'}`}>
                    ${returnData.lateFee.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!returnData.returnDate || loading}
            loading={loading}
            iconName="Check"
            iconPosition="left"
            variant={returnData.lateFee > 0 ? "warning" : "success"}
          >
            {returnData.lateFee > 0 ? `Procesar con Multa $${returnData.lateFee.toFixed(2)}` : 'Procesar Devolución'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReturnModal;
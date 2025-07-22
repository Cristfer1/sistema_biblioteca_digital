import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LoanTable = ({
  loans,
  sortConfig,
  onSort,
  onReturnBook,
  onViewUser,
  onViewBook,
  loading
}) => {
  const [selectedLoans, setSelectedLoans] = useState([]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedLoans(loans?.map(loan => loan?.id) || []);
    } else {
      setSelectedLoans([]);
    }
  };

  const handleSelectLoan = (loanId, checked) => {
    if (checked) {
      setSelectedLoans([...selectedLoans, loanId]);
    } else {
      setSelectedLoans(selectedLoans.filter(id => id !== loanId));
    }
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-primary/10 text-primary`;
      case 'returned':
        return `${baseClasses} bg-success/10 text-success`;
      case 'overdue':
        return `${baseClasses} bg-error/10 text-error`;
      default:
        return `${baseClasses} bg-muted text-text-secondary`;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'returned':
        return 'Devuelto';
      case 'overdue':
        return 'Vencido';
      default:
        return 'Desconocido';
    }
  };

  const isOverdue = (loan) => {
    if (loan?.status === 'returned') return false;
    return new Date(loan?.dueDate) < new Date();
  };

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="text-center text-text-secondary">
          Cargando préstamos...
        </div>
      </div>
    );
  }

  if (!loans || loans.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="text-center">
          <Icon name="FileText" size={48} className="mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No se encontraron préstamos
          </h3>
          <p className="text-text-secondary">
            No hay préstamos que coincidan con los filtros aplicados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedLoans.length === loans.length && loans.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => onSort({ key: 'loanId', direction: sortConfig?.key === 'loanId' && sortConfig?.direction === 'asc' ? 'desc' : 'asc' })}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary"
                >
                  <span>ID Préstamo</span>
                  <Icon name={getSortIcon('loanId')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => onSort({ key: 'userName', direction: sortConfig?.key === 'userName' && sortConfig?.direction === 'asc' ? 'desc' : 'asc' })}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary"
                >
                  <span>Usuario</span>
                  <Icon name={getSortIcon('userName')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => onSort({ key: 'bookTitle', direction: sortConfig?.key === 'bookTitle' && sortConfig?.direction === 'asc' ? 'desc' : 'asc' })}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary"
                >
                  <span>Libro</span>
                  <Icon name={getSortIcon('bookTitle')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => onSort({ key: 'loanDate', direction: sortConfig?.key === 'loanDate' && sortConfig?.direction === 'asc' ? 'desc' : 'asc' })}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary"
                >
                  <span>Fecha Préstamo</span>
                  <Icon name={getSortIcon('loanDate')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-text-primary">Fecha Vencimiento</span>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-text-primary">Fecha Devolución</span>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-text-primary">Estado</span>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-text-primary">Multa</span>
              </th>
              <th className="text-center p-4">
                <span className="text-sm font-medium text-text-primary">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loans.map((loan) => (
              <tr 
                key={loan?.id} 
                className={`hover:bg-muted/50 ${isOverdue(loan) ? 'bg-error/5 border-l-4 border-l-error' : ''}`}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedLoans.includes(loan?.id)}
                    onChange={(e) => handleSelectLoan(loan?.id, e.target.checked)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-4">
                  <span className="font-mono text-sm text-text-primary font-medium">
                    {loan?.loanId}
                  </span>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <button
                      onClick={() => onViewUser(loan?.userId)}
                      className="font-medium text-text-primary hover:text-primary transition-colors"
                    >
                      {loan?.userName}
                    </button>
                    <div className="text-sm text-text-secondary">
                      {loan?.userEmail}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <button
                      onClick={() => onViewBook(loan?.bookId)}
                      className="font-medium text-text-primary hover:text-primary transition-colors line-clamp-2"
                    >
                      {loan?.bookTitle}
                    </button>
                    <div className="text-sm text-text-secondary">
                      {loan?.bookAuthor}
                    </div>
                    <div className="text-xs text-text-secondary font-mono">
                      {loan?.bookIsbn}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-text-secondary">
                    {formatDate(loan?.loanDate)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <span className={`text-sm ${isOverdue(loan) && loan?.status !== 'returned' ? 'text-error font-medium' : 'text-text-secondary'}`}>
                      {formatDate(loan?.dueDate)}
                    </span>
                    {isOverdue(loan) && loan?.status !== 'returned' && (
                      <div className="text-xs text-error">
                        {getDaysOverdue(loan?.dueDate)} días vencido
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-text-secondary">
                    {formatDate(loan?.returnDate)}
                  </span>
                </td>
                <td className="p-4">
                  <span className={getStatusBadge(loan?.status)}>
                    {getStatusText(loan?.status)}
                  </span>
                </td>
                <td className="p-4">
                  {loan?.lateFee > 0 ? (
                    <span className="font-medium text-error">
                      ${loan.lateFee.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-text-secondary">-</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewUser(loan?.userId)}
                      iconName="User"
                      title="Ver usuario"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewBook(loan?.bookId)}
                      iconName="Book"
                      title="Ver libro"
                    />
                    {loan?.status !== 'returned' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReturnBook(loan)}
                        iconName="RotateCcw"
                        title="Procesar devolución"
                        className="text-primary hover:text-primary/80"
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {loans.map((loan) => (
          <div 
            key={loan?.id} 
            className={`bg-background border border-border rounded-lg p-4 ${
              isOverdue(loan) && loan?.status !== 'returned' ? 'border-l-4 border-l-error bg-error/5' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedLoans.includes(loan?.id)}
                  onChange={(e) => handleSelectLoan(loan?.id, e.target.checked)}
                  className="rounded border-border mt-1"
                />
                <div>
                  <h3 className="font-mono text-sm font-medium text-text-primary">
                    {loan?.loanId}
                  </h3>
                  <span className={getStatusBadge(loan?.status)}>
                    {getStatusText(loan?.status)}
                  </span>
                </div>
              </div>
              {isOverdue(loan) && loan?.status !== 'returned' && (
                <div className="text-right">
                  <div className="text-xs text-error font-medium">
                    VENCIDO
                  </div>
                  <div className="text-xs text-error">
                    {getDaysOverdue(loan?.dueDate)} días
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div className="border-b border-border pb-2">
                <div className="text-sm text-text-secondary mb-1">Usuario</div>
                <button
                  onClick={() => onViewUser(loan?.userId)}
                  className="font-medium text-text-primary hover:text-primary"
                >
                  {loan?.userName}
                </button>
                <div className="text-sm text-text-secondary">{loan?.userEmail}</div>
              </div>

              <div className="border-b border-border pb-2">
                <div className="text-sm text-text-secondary mb-1">Libro</div>
                <button
                  onClick={() => onViewBook(loan?.bookId)}
                  className="font-medium text-text-primary hover:text-primary line-clamp-2"
                >
                  {loan?.bookTitle}
                </button>
                <div className="text-sm text-text-secondary">{loan?.bookAuthor}</div>
                <div className="text-xs text-text-secondary font-mono">{loan?.bookIsbn}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-text-secondary">Préstamo:</span>
                  <div className="font-medium">{formatDate(loan?.loanDate)}</div>
                </div>
                <div>
                  <span className="text-text-secondary">Vencimiento:</span>
                  <div className={`font-medium ${
                    isOverdue(loan) && loan?.status !== 'returned' ? 'text-error' : ''
                  }`}>
                    {formatDate(loan?.dueDate)}
                  </div>
                </div>
                <div>
                  <span className="text-text-secondary">Devolución:</span>
                  <div className="font-medium">{formatDate(loan?.returnDate)}</div>
                </div>
                <div>
                  <span className="text-text-secondary">Multa:</span>
                  <div className={`font-medium ${loan?.lateFee > 0 ? 'text-error' : ''}`}>
                    {loan?.lateFee > 0 ? `$${loan.lateFee.toFixed(2)}` : '-'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewUser(loan?.userId)}
                iconName="User"
                iconPosition="left"
              >
                Usuario
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewBook(loan?.bookId)}
                iconName="Book"
                iconPosition="left"
              >
                Libro
              </Button>
              {loan?.status !== 'returned' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReturnBook(loan)}
                  iconName="RotateCcw"
                  iconPosition="left"
                  className="text-primary border-primary hover:bg-primary/10"
                >
                  Devolver
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanTable;
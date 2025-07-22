import React, { useState, useEffect, useMemo } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const LoanModal = ({
  users,
  books,
  isOpen,
  onClose,
  onSave,
  loading
}) => {
  const [formData, setFormData] = useState({
    userId: '',
    bookId: '',
    loanDate: '',
    dueDate: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookSearchTerm, setBookSearchTerm] = useState('');

  // Calculate default dates
  const today = new Date().toISOString().split('T')[0];
  const defaultDueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        userId: '',
        bookId: '',
        loanDate: today,
        dueDate: defaultDueDate
      });
      setSelectedUser(null);
      setSelectedBook(null);
      setBookSearchTerm('');
    }
  }, [isOpen, today, defaultDueDate]);

  // User options for select
  const userOptions = useMemo(() => [
    { value: '', label: 'Seleccionar usuario' },
    ...(users || []).map(user => ({
      value: user?.id,
      label: `${user?.name} (${user?.userId})`,
      description: user?.email
    }))
  ], [users]);

  // Available books (filtered by search and availability)
  const availableBooks = useMemo(() => {
    return (books || [])
      .filter(book => book?.availableCopies > 0)
      .filter(book => {
        if (!bookSearchTerm) return true;
        const searchLower = bookSearchTerm.toLowerCase();
        return (
          book?.title?.toLowerCase().includes(searchLower) ||
          book?.author?.toLowerCase().includes(searchLower) ||
          book?.isbn?.includes(bookSearchTerm) ||
          book?.code?.toLowerCase().includes(searchLower)
        );
      });
  }, [books, bookSearchTerm]);

  // Update selected user when userId changes
  useEffect(() => {
    const user = users?.find(u => u?.id === formData.userId);
    setSelectedUser(user || null);
  }, [formData.userId, users]);

  // Update selected book when bookId changes
  useEffect(() => {
    const book = books?.find(b => b?.id === formData.bookId);
    setSelectedBook(book || null);
  }, [formData.bookId, books]);

  // Auto-calculate due date when loan date changes
  useEffect(() => {
    if (formData.loanDate) {
      const loanDate = new Date(formData.loanDate);
      const dueDate = new Date(loanDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.loanDate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBookSelect = (book) => {
    setFormData(prev => ({
      ...prev,
      bookId: book?.id
    }));
    setBookSearchTerm('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.bookId || !formData.loanDate) {
      return;
    }

    const loanData = {
      userId: formData.userId,
      userName: selectedUser?.name,
      userEmail: selectedUser?.email,
      bookId: formData.bookId,
      bookTitle: selectedBook?.title,
      bookAuthor: selectedBook?.author,
      bookIsbn: selectedBook?.isbn,
      loanDate: formData.loanDate,
      dueDate: formData.dueDate
    };

    onSave(loanData);
  };

  const isFormValid = formData.userId && formData.bookId && formData.loanDate;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Plus" size={20} className="text-primary" />
            <h2 className="text-xl font-semibold text-text-primary">
              Nuevo Préstamo
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Selection */}
            <div>
              <Select
                label="Usuario"
                required
                options={userOptions}
                value={formData.userId}
                onChange={(value) => handleInputChange('userId', value)}
                placeholder="Buscar y seleccionar usuario"
                searchable
                error={!formData.userId && "Seleccione un usuario"}
              />
              
              {selectedUser && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="white" />
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">
                        {selectedUser.name}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {selectedUser.email} • ID: {selectedUser.userId}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Book Selection */}
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                Libro <span className="text-error">*</span>
              </label>
              
              {/* Book Search */}
              <div className="relative mb-3">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <Input
                  placeholder="Buscar por título, autor, ISBN o código..."
                  value={bookSearchTerm}
                  onChange={(e) => setBookSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Available Books List */}
              <div className="border border-border rounded-lg max-h-40 overflow-y-auto">
                {availableBooks.length === 0 ? (
                  <div className="p-4 text-center text-text-secondary">
                    {bookSearchTerm ? 'No se encontraron libros disponibles' : 'No hay libros disponibles'}
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {availableBooks.map((book) => (
                      <button
                        key={book?.id}
                        type="button"
                        onClick={() => handleBookSelect(book)}
                        className={`w-full p-3 text-left hover:bg-muted transition-colors ${
                          formData.bookId === book?.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-text-primary line-clamp-1">
                              {book?.title}
                            </div>
                            <div className="text-sm text-text-secondary">
                              {book?.author} • {book?.isbn}
                            </div>
                            <div className="text-xs text-text-secondary">
                              Código: {book?.code} • Categoría: {book?.category}
                            </div>
                          </div>
                          <div className="ml-3 text-right">
                            <div className="text-sm font-medium text-success">
                              {book?.availableCopies} disponibles
                            </div>
                            <div className="text-xs text-text-secondary">
                              de {book?.totalCopies} total
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Book Display */}
              {selectedBook && (
                <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="Book" size={16} className="text-primary" />
                    <div>
                      <div className="font-medium text-text-primary">
                        {selectedBook.title}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {selectedBook.author} • {selectedBook.isbn}
                      </div>
                      <div className="text-xs text-success">
                        {selectedBook.availableCopies} copias disponibles
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Fecha de Préstamo"
                required
                value={formData.loanDate}
                onChange={(e) => handleInputChange('loanDate', e.target.value)}
                min={today}
              />
              
              <Input
                type="date"
                label="Fecha de Vencimiento"
                required
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                min={formData.loanDate || today}
                description="Se calcula automáticamente (14 días)"
              />
            </div>

            {/* Loan Summary */}
            {isFormValid && (
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium text-text-primary mb-3">
                  Resumen del Préstamo
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Usuario:</span>
                    <span className="text-text-primary font-medium">
                      {selectedUser?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Libro:</span>
                    <span className="text-text-primary font-medium">
                      {selectedBook?.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Fecha préstamo:</span>
                    <span className="text-text-primary font-medium">
                      {new Date(formData.loanDate).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Fecha vencimiento:</span>
                    <span className="text-text-primary font-medium">
                      {new Date(formData.dueDate).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              </div>
            )}
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
            disabled={!isFormValid || loading}
            loading={loading}
            iconName="Check"
            iconPosition="left"
          >
            Crear Préstamo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoanModal;
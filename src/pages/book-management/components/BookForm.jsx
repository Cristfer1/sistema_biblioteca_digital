import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BookForm = ({
  book = null,
  isOpen,
  onClose,
  onSave,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    type: 'libro',
    volume: '1',
    publicationYear: new Date().getFullYear().toString(),
    pages: '',
    keywords: '',
    category: 'tecnología',
    storageType: 'físico',
    totalCopies: '1'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        isbn: book.isbn || '',
        title: book.title || '',
        author: book.author || '',
        type: book.type || 'libro',
        volume: book.volume?.toString() || '1',
        publicationYear: book.publicationYear?.toString() || new Date().getFullYear().toString(),
        pages: book.pages?.toString() || '',
        keywords: book.keywords || '',
        category: book.category || 'tecnología',
        storageType: book.storageType || 'físico',
        totalCopies: book.totalCopies?.toString() || '1'
      });
    } else {
      setFormData({
        isbn: '',
        title: '',
        author: '',
        type: 'libro',
        volume: '1',
        publicationYear: new Date().getFullYear().toString(),
        pages: '',
        keywords: '',
        category: 'tecnología',
        storageType: 'físico',
        totalCopies: '1'
      });
    }
    setErrors({});
  }, [book, isOpen]);

  const typeOptions = [
    { value: 'libro', label: 'Libro' },
    { value: 'revista', label: 'Revista' }
  ];

  const categoryOptions = [
    { value: 'tecnología', label: 'Tecnología' },
    { value: 'ciencia', label: 'Ciencia' }
  ];

  const storageTypeOptions = [
    { value: 'físico', label: 'Físico' },
    { value: 'virtual', label: 'Virtual' }
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 100 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'El ISBN es obligatorio';
    } else if (!/^[\d-]{10,17}$/.test(formData.isbn.replace(/[-\s]/g, ''))) {
      newErrors.isbn = 'Formato de ISBN inválido';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'El autor es obligatorio';
    }

    if (!formData.pages || parseInt(formData.pages) < 1) {
      newErrors.pages = 'El número de páginas debe ser mayor a 0';
    }

    if (!formData.totalCopies || parseInt(formData.totalCopies) < 1) {
      newErrors.totalCopies = 'El número de copias debe ser mayor a 0';
    }

    const year = parseInt(formData.publicationYear);
    if (year < 1000 || year > currentYear) {
      newErrors.publicationYear = `El año debe estar entre 1000 y ${currentYear}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateBookCode = (category) => {
    const prefix = category === 'tecnología' ? 'TEC' : 'CIE';
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${randomNum}`;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const bookData = {
        ...formData,
        volume: parseInt(formData.volume),
        publicationYear: parseInt(formData.publicationYear),
        pages: parseInt(formData.pages),
        totalCopies: parseInt(formData.totalCopies),
        availableCopies: book ? book.availableCopies : parseInt(formData.totalCopies),
        code: book ? book.code : generateBookCode(formData.category),
        id: book ? book.id : `book-${Date.now()}`
      };

      await onSave(bookData);
      onClose();
    } catch (error) {
      console.error('Error saving book:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (book) {
      setFormData({
        isbn: book.isbn || '',
        title: book.title || '',
        author: book.author || '',
        type: book.type || 'libro',
        volume: book.volume?.toString() || '1',
        publicationYear: book.publicationYear?.toString() || new Date().getFullYear().toString(),
        pages: book.pages?.toString() || '',
        keywords: book.keywords || '',
        category: book.category || 'tecnología',
        storageType: book.storageType || 'físico',
        totalCopies: book.totalCopies?.toString() || '1'
      });
    } else {
      setFormData({
        isbn: '',
        title: '',
        author: '',
        type: 'libro',
        volume: '1',
        publicationYear: new Date().getFullYear().toString(),
        pages: '',
        keywords: '',
        category: 'tecnología',
        storageType: 'físico',
        totalCopies: '1'
      });
    }
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="BookOpen" size={18} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                {book ? 'Editar Libro' : 'Agregar Nuevo Libro'}
              </h2>
              <p className="text-sm text-text-secondary">
                {book ? 'Modifica la información del libro' : 'Completa los datos del nuevo libro'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            className="text-text-secondary hover:text-text-primary"
          />
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ISBN and Title Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="ISBN"
                type="text"
                placeholder="978-3-16-148410-0"
                value={formData.isbn}
                onChange={(e) => handleInputChange('isbn', e.target.value)}
                error={errors.isbn}
                required
              />
              <Input
                label="Título"
                type="text"
                placeholder="Título del libro"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                error={errors.title}
                required
              />
            </div>

            {/* Author and Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Autor"
                type="text"
                placeholder="Nombre del autor"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                error={errors.author}
                required
              />
              <Select
                label="Tipo"
                options={typeOptions}
                value={formData.type}
                onChange={(value) => handleInputChange('type', value)}
                required
              />
            </div>

            {/* Category and Storage Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Categoría"
                options={categoryOptions}
                value={formData.category}
                onChange={(value) => handleInputChange('category', value)}
                required
              />
              <Select
                label="Tipo de almacenamiento"
                options={storageTypeOptions}
                value={formData.storageType}
                onChange={(value) => handleInputChange('storageType', value)}
                required
              />
            </div>

            {/* Volume, Year, and Pages Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Volumen"
                type="number"
                placeholder="1"
                value={formData.volume}
                onChange={(e) => handleInputChange('volume', e.target.value)}
                min="1"
                required
              />
              <Select
                label="Año de publicación"
                options={yearOptions}
                value={formData.publicationYear}
                onChange={(value) => handleInputChange('publicationYear', value)}
                error={errors.publicationYear}
                searchable
                required
              />
              <Input
                label="Páginas"
                type="number"
                placeholder="200"
                value={formData.pages}
                onChange={(e) => handleInputChange('pages', e.target.value)}
                error={errors.pages}
                min="1"
                required
              />
            </div>

            {/* Total Copies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Número de copias"
                type="number"
                placeholder="1"
                value={formData.totalCopies}
                onChange={(e) => handleInputChange('totalCopies', e.target.value)}
                error={errors.totalCopies}
                min="1"
                required
              />
              {book && (
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-text-primary mb-2">
                    Código del libro
                  </label>
                  <div className="px-3 py-2 bg-muted border border-border rounded-md text-sm font-mono text-text-primary">
                    {book.code}
                  </div>
                </div>
              )}
            </div>

            {/* Keywords */}
            <Input
              label="Palabras clave"
              type="text"
              placeholder="programación, desarrollo, tecnología"
              value={formData.keywords}
              onChange={(e) => handleInputChange('keywords', e.target.value)}
              description="Separa las palabras clave con comas"
            />

            {/* Generated Code Preview for New Books */}
            {!book && (
              <div className="p-4 bg-muted border border-border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Info" size={16} className="text-accent" />
                  <span className="text-sm font-medium text-text-primary">Código generado automáticamente</span>
                </div>
                <div className="text-sm font-mono text-text-primary">
                  {generateBookCode(formData.category)}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/50">
          <Button
            variant="outline"
            onClick={handleReset}
            iconName="RotateCcw"
            iconPosition="left"
            disabled={isSubmitting}
          >
            Restablecer
          </Button>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={handleSubmit}
              loading={isSubmitting}
              iconName="Save"
              iconPosition="left"
            >
              {book ? 'Actualizar' : 'Guardar'} Libro
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookForm;
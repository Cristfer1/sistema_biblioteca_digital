import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import BookFilters from './components/BookFilters';
import BookTable from './components/BookTable';
import BookForm from './components/BookForm';
import BookDetailsModal from './components/BookDetailsModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import BookToolbar from './components/BookToolbar';

const BookManagement = () => {
  // Mock user data
  const mockUser = {
    id: 'admin-001',
    name: 'María González',
    email: 'maria.gonzalez@biblioteca.com',
    role: 'Administrador'
  };

  // State management
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    publicationYear: '',
    availability: '',
    storageType: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Mock books data
  const mockBooks = [
    {
      id: 'book-001',
      isbn: '978-3-16-148410-0',
      title: 'Introducción a la Programación',
      author: 'Carlos Mendoza',
      type: 'libro',
      volume: 1,
      publicationYear: 2023,
      pages: 450,
      keywords: 'programación, desarrollo, algoritmos',
      category: 'tecnología',
      storageType: 'físico',
      totalCopies: 5,
      availableCopies: 3,
      code: 'TEC-001'
    },
    {
      id: 'book-002',
      isbn: '978-0-321-56384-2',
      title: 'Física Cuántica Moderna',
      author: 'Ana Rodríguez',
      type: 'libro',
      volume: 2,
      publicationYear: 2022,
      pages: 680,
      keywords: 'física, cuántica, mecánica',
      category: 'ciencia',
      storageType: 'físico',
      totalCopies: 3,
      availableCopies: 1,
      code: 'CIE-001'
    },
    {
      id: 'book-003',
      isbn: '978-1-449-31979-3',
      title: 'Desarrollo Web con React',
      author: 'Luis Fernández',
      type: 'libro',
      volume: 1,
      publicationYear: 2024,
      pages: 520,
      keywords: 'react, javascript, frontend',
      category: 'tecnología',
      storageType: 'virtual',
      totalCopies: 10,
      availableCopies: 8,
      code: 'TEC-002'
    },
    {
      id: 'book-004',
      isbn: '978-0-596-52068-7',
      title: 'Biología Molecular',
      author: 'Patricia Silva',
      type: 'revista',
      volume: 3,
      publicationYear: 2023,
      pages: 120,
      keywords: 'biología, molecular, genética',
      category: 'ciencia',
      storageType: 'físico',
      totalCopies: 2,
      availableCopies: 2,
      code: 'CIE-002'
    },
    {
      id: 'book-005',
      isbn: '978-1-118-94018-8',
      title: 'Inteligencia Artificial',
      author: 'Roberto Martín',
      type: 'libro',
      volume: 1,
      publicationYear: 2023,
      pages: 750,
      keywords: 'IA, machine learning, algoritmos',
      category: 'tecnología',
      storageType: 'virtual',
      totalCopies: 7,
      availableCopies: 4,
      code: 'TEC-003'
    },
    {
      id: 'book-006',
      isbn: '978-0-134-68517-4',
      title: 'Química Orgánica Avanzada',
      author: 'Elena Vásquez',
      type: 'libro',
      volume: 2,
      publicationYear: 2021,
      pages: 890,
      keywords: 'química, orgánica, síntesis',
      category: 'ciencia',
      storageType: 'físico',
      totalCopies: 4,
      availableCopies: 0,
      code: 'CIE-003'
    }
  ];

  // Initialize books data
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBooks(mockBooks);
      setLoading(false);
    };

    loadBooks();
  }, []);

  // Filter and sort books
  const filteredAndSortedBooks = useMemo(() => {
    let filtered = books.filter(book => {
      const matchesSearch = !filters.search || 
        book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        book.author.toLowerCase().includes(filters.search.toLowerCase()) ||
        book.isbn.includes(filters.search) ||
        book.code.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory = !filters.category || book.category === filters.category;
      const matchesYear = !filters.publicationYear || book.publicationYear.toString() === filters.publicationYear;
      const matchesAvailability = !filters.availability || 
        (filters.availability === 'available' && book.availableCopies > 0) ||
        (filters.availability === 'unavailable' && book.availableCopies === 0);
      const matchesStorageType = !filters.storageType || book.storageType === filters.storageType;

      return matchesSearch && matchesCategory && matchesYear && matchesAvailability && matchesStorageType;
    });

    // Sort books
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [books, filters, sortConfig]);

  // Event handlers
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      publicationYear: '',
      availability: '',
      storageType: ''
    });
  };

  const handleSort = (config) => {
    setSortConfig(config);
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setIsFormOpen(true);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setIsFormOpen(true);
  };

  const handleViewDetails = (book) => {
    setSelectedBook(book);
    setIsDetailsOpen(true);
  };

  const handleDeleteBook = (book) => {
    setSelectedBook(book);
    setIsDeleteOpen(true);
  };

  const handleSaveBook = async (bookData) => {
    setFormLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedBook) {
        // Update existing book
        setBooks(prev => prev.map(book => 
          book.id === selectedBook.id ? { ...bookData, id: selectedBook.id } : book
        ));
      } else {
        // Add new book
        setBooks(prev => [...prev, bookData]);
      }
      
      setIsFormOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error('Error saving book:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async (book) => {
    setDeleteLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBooks(prev => prev.filter(b => b.id !== book.id));
      setIsDeleteOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error('Error deleting book:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleBulkAction = (action, selectedIds) => {
    console.log('Bulk action:', action, selectedIds);
    // Implement bulk actions here
  };

  const handleExport = () => {
    console.log('Exporting books...');
    // Implement export functionality here
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // Implement logout functionality
  };

  if (loading) {
    return <LoadingSpinner overlay size="lg" text="Cargando sistema de gestión de libros..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} onLogout={handleLogout} />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-primary mb-2">Gestión de Libros</h1>
            <p className="text-text-secondary">
              Administra el inventario completo de libros de la biblioteca digital
            </p>
          </div>

          {/* Toolbar */}
          <BookToolbar
            totalBooks={books.length}
            filteredBooks={filteredAndSortedBooks.length}
            selectedBooks={selectedBooks}
            onAddBook={handleAddBook}
            onBulkAction={handleBulkAction}
            onExport={handleExport}
            loading={loading}
          />

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Panel */}
            <div className={`transition-all duration-300 ${isFiltersCollapsed ? 'lg:w-16' : 'lg:w-80'}`}>
              <BookFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                isCollapsed={isFiltersCollapsed}
                onToggleCollapse={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
              />
            </div>

            {/* Books Table */}
            <div className="flex-1">
              <BookTable
                books={filteredAndSortedBooks}
                sortConfig={sortConfig}
                onSort={handleSort}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
                onViewDetails={handleViewDetails}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <BookForm
        book={selectedBook}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedBook(null);
        }}
        onSave={handleSaveBook}
        loading={formLoading}
      />

      <BookDetailsModal
        book={selectedBook}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedBook(null);
        }}
        onEdit={handleEditBook}
      />

      <DeleteConfirmationModal
        book={selectedBook}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedBook(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
};

export default BookManagement;
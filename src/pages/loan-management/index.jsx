import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import LoanFilters from './components/LoanFilters';
import LoanTable from './components/LoanTable';
import LoanModal from './components/LoanModal';
import ReturnModal from './components/ReturnModal';
import LoanToolbar from './components/LoanToolbar';

const LoanManagement = () => {
  // Mock user data
  const mockUser = {
    id: 'admin-001',
    name: 'María González',
    email: 'maria.gonzalez@biblioteca.com',
    role: 'Administrador'
  };

  // State management
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    loanDateRange: { from: '', to: '' },
    returnDateRange: { from: '', to: '' },
    category: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'loanDate', direction: 'desc' });
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  
  // Modal states
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Mock data
  const mockUsers = [
    { id: 'user-001', userId: 'USR001', name: 'Ana García', email: 'ana.garcia@email.com' },
    { id: 'user-002', userId: 'USR002', name: 'Carlos Ruiz', email: 'carlos.ruiz@email.com' },
    { id: 'user-003', userId: 'USR003', name: 'Elena López', email: 'elena.lopez@email.com' },
    { id: 'user-004', userId: 'USR004', name: 'Miguel Torres', email: 'miguel.torres@email.com' }
  ];

  const mockBooks = [
    {
      id: 'book-001',
      isbn: '978-3-16-148410-0',
      title: 'Introducción a la Programación',
      author: 'Carlos Mendoza',
      category: 'tecnología',
      availableCopies: 3,
      totalCopies: 5,
      code: 'TEC-001'
    },
    {
      id: 'book-002',
      isbn: '978-0-321-56384-2',
      title: 'Física Cuántica Moderna',
      author: 'Ana Rodríguez',
      category: 'ciencia',
      availableCopies: 1,
      totalCopies: 3,
      code: 'CIE-001'
    },
    {
      id: 'book-003',
      isbn: '978-1-449-31979-3',
      title: 'Desarrollo Web con React',
      author: 'Luis Fernández',
      category: 'tecnología',
      availableCopies: 8,
      totalCopies: 10,
      code: 'TEC-002'
    }
  ];

  const mockLoans = [
    {
      id: 'loan-001',
      loanId: 'PRE001',
      userId: 'user-001',
      userName: 'Ana García',
      userEmail: 'ana.garcia@email.com',
      bookId: 'book-001',
      bookTitle: 'Introducción a la Programación',
      bookAuthor: 'Carlos Mendoza',
      bookIsbn: '978-3-16-148410-0',
      loanDate: '2025-07-15',
      dueDate: '2025-07-29',
      returnDate: null,
      status: 'active',
      lateFee: 0
    },
    {
      id: 'loan-002',
      loanId: 'PRE002',
      userId: 'user-002',
      userName: 'Carlos Ruiz',
      userEmail: 'carlos.ruiz@email.com',
      bookId: 'book-002',
      bookTitle: 'Física Cuántica Moderna',
      bookAuthor: 'Ana Rodríguez',
      bookIsbn: '978-0-321-56384-2',
      loanDate: '2025-07-10',
      dueDate: '2025-07-24',
      returnDate: null,
      status: 'overdue',
      lateFee: 15.50
    },
    {
      id: 'loan-003',
      loanId: 'PRE003',
      userId: 'user-003',
      userName: 'Elena López',
      userEmail: 'elena.lopez@email.com',
      bookId: 'book-003',
      bookTitle: 'Desarrollo Web con React',
      bookAuthor: 'Luis Fernández',
      bookIsbn: '978-1-449-31979-3',
      loanDate: '2025-07-01',
      dueDate: '2025-07-15',
      returnDate: '2025-07-14',
      status: 'returned',
      lateFee: 0
    },
    {
      id: 'loan-004',
      loanId: 'PRE004',
      userId: 'user-004',
      userName: 'Miguel Torres',
      userEmail: 'miguel.torres@email.com',
      bookId: 'book-001',
      bookTitle: 'Introducción a la Programación',
      bookAuthor: 'Carlos Mendoza',
      bookIsbn: '978-3-16-148410-0',
      loanDate: '2025-07-20',
      dueDate: '2025-08-03',
      returnDate: null,
      status: 'active',
      lateFee: 0
    }
  ];

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoans(mockLoans);
      setUsers(mockUsers);
      setBooks(mockBooks);
      setLoading(false);
    };

    loadData();
  }, []);

  // Filter and sort loans
  const filteredAndSortedLoans = useMemo(() => {
    let filtered = loans?.filter(loan => {
      const matchesSearch = !filters.search || 
        loan?.loanId?.toLowerCase().includes(filters.search.toLowerCase()) ||
        loan?.userName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        loan?.userEmail?.toLowerCase().includes(filters.search.toLowerCase()) ||
        loan?.bookTitle?.toLowerCase().includes(filters.search.toLowerCase()) ||
        loan?.bookAuthor?.toLowerCase().includes(filters.search.toLowerCase()) ||
        loan?.bookIsbn?.includes(filters.search);

      const matchesStatus = !filters.status || loan?.status === filters.status;

      const matchesLoanDate = (!filters.loanDateRange?.from || new Date(loan?.loanDate) >= new Date(filters.loanDateRange.from)) &&
                             (!filters.loanDateRange?.to || new Date(loan?.loanDate) <= new Date(filters.loanDateRange.to));

      const matchesReturnDate = !filters.returnDateRange?.from && !filters.returnDateRange?.to ||
                              (loan?.returnDate && 
                               (!filters.returnDateRange?.from || new Date(loan.returnDate) >= new Date(filters.returnDateRange.from)) &&
                               (!filters.returnDateRange?.to || new Date(loan.returnDate) <= new Date(filters.returnDateRange.to)));

      const book = books?.find(b => b.id === loan?.bookId);
      const matchesCategory = !filters.category || book?.category === filters.category;

      return matchesSearch && matchesStatus && matchesLoanDate && matchesReturnDate && matchesCategory;
    }) || [];

    // Sort loans
    if (sortConfig?.key) {
      filtered.sort((a, b) => {
        let aValue = a?.[sortConfig.key];
        let bValue = b?.[sortConfig.key];

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue?.toLowerCase();
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
  }, [loans, filters, sortConfig, books]);

  // Get overdue count
  const overdueCount = useMemo(() => {
    return loans?.filter(loan => loan?.status === 'overdue')?.length || 0;
  }, [loans]);

  // Event handlers
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      loanDateRange: { from: '', to: '' },
      returnDateRange: { from: '', to: '' },
      category: ''
    });
  };

  const handleSort = (config) => {
    setSortConfig(config);
  };

  const handleCreateLoan = () => {
    setSelectedLoan(null);
    setIsLoanModalOpen(true);
  };

  const handleReturnBook = (loan) => {
    setSelectedLoan(loan);
    setIsReturnModalOpen(true);
  };

  const handleViewUser = (userId) => {
    console.log('View user:', userId);
    // Navigate to user profile
  };

  const handleViewBook = (bookId) => {
    console.log('View book:', bookId);
    // Navigate to book details
  };

  const handleSaveLoan = async (loanData) => {
    setModalLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newLoan = {
        id: `loan-${Date.now()}`,
        loanId: `PRE${String(loans?.length + 1).padStart(3, '0')}`,
        ...loanData,
        status: 'active',
        lateFee: 0,
        returnDate: null
      };
      
      setLoans(prev => [...(prev || []), newLoan]);
      
      // Update book availability
      setBooks(prev => prev?.map(book => 
        book.id === loanData.bookId 
          ? { ...book, availableCopies: book.availableCopies - 1 }
          : book
      ) || []);
      
      setIsLoanModalOpen(false);
    } catch (error) {
      console.error('Error creating loan:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleConfirmReturn = async (returnData) => {
    setModalLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoans(prev => prev?.map(loan => 
        loan.id === selectedLoan?.id 
          ? { 
              ...loan, 
              status: 'returned', 
              returnDate: returnData.returnDate,
              lateFee: returnData.lateFee 
            }
          : loan
      ) || []);
      
      // Update book availability
      setBooks(prev => prev?.map(book => 
        book.id === selectedLoan?.bookId 
          ? { ...book, availableCopies: book.availableCopies + 1 }
          : book
      ) || []);
      
      setIsReturnModalOpen(false);
      setSelectedLoan(null);
    } catch (error) {
      console.error('Error processing return:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleBulkReturn = (selectedIds) => {
    console.log('Bulk return:', selectedIds);
    // Implement bulk return functionality
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // Implement logout functionality
  };

  if (loading) {
    return <LoadingSpinner overlay size="lg" text="Cargando sistema de gestión de préstamos..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} onLogout={handleLogout} />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-primary mb-2">Gestión de Préstamos</h1>
            <p className="text-text-secondary">
              Administra el seguimiento y procesamiento de préstamos de libros
            </p>
          </div>

          {/* Toolbar */}
          <LoanToolbar
            totalLoans={loans?.length || 0}
            filteredLoans={filteredAndSortedLoans?.length || 0}
            overdueCount={overdueCount}
            onCreateLoan={handleCreateLoan}
            onBulkReturn={handleBulkReturn}
          />

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Panel */}
            <div className={`transition-all duration-300 ${isFiltersCollapsed ? 'lg:w-16' : 'lg:w-80'}`}>
              <LoanFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                isCollapsed={isFiltersCollapsed}
                onToggleCollapse={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
                books={books}
              />
            </div>

            {/* Loans Table */}
            <div className="flex-1">
              <LoanTable
                loans={filteredAndSortedLoans}
                sortConfig={sortConfig}
                onSort={handleSort}
                onReturnBook={handleReturnBook}
                onViewUser={handleViewUser}
                onViewBook={handleViewBook}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <LoanModal
        users={users}
        books={books}
        isOpen={isLoanModalOpen}
        onClose={() => {
          setIsLoanModalOpen(false);
          setSelectedLoan(null);
        }}
        onSave={handleSaveLoan}
        loading={modalLoading}
      />

      <ReturnModal
        loan={selectedLoan}
        isOpen={isReturnModalOpen}
        onClose={() => {
          setIsReturnModalOpen(false);
          setSelectedLoan(null);
        }}
        onConfirm={handleConfirmReturn}
        loading={modalLoading}
      />
    </div>
  );
};

export default LoanManagement;
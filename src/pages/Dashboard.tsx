import React, { useState } from 'react';
import AddContestantModal from '../components/dashboard/AddContestantModal';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFilters from '../components/dashboard/DashboardFilters';
import ContestantTable from '../components/dashboard/ContestantTable';
import Pagination from '../components/dashboard/Pagination';

// Mock Data
const MOCK_CONTESTANTS = [
  { id: 1, name: "Kasun Perera", contestantId: "SB-26-001", category: "Announcing", mobile: "077 123 4567", nic: "200512345678" },
  { id: 2, name: "Amaya Silva", contestantId: "SB-26-002", category: "Debating", mobile: "071 987 6543", nic: "200698765432" },
  { id: 3, name: "Themiya Gunawardena", contestantId: "SB-26-003", category: "Creative Writing", mobile: "076 555 1234", nic: "200555512345" },
  { id: 4, name: "Nethmi Dias", contestantId: "SB-26-004", category: "Announcing", mobile: "070 444 9876", nic: "200644498765" },
  { id: 5, name: "Sahan Fernando", contestantId: "SB-26-005", category: "Photography", mobile: "075 111 2222", nic: "200411122233" },
  { id: 6, name: "Dinithi Liyanage", contestantId: "SB-26-006", category: "Debating", mobile: "072 333 4444", nic: "200533344455" },
  { id: 7, name: "Kavindu Bandara", contestantId: "SB-26-007", category: "Short Film", mobile: "078 999 0000", nic: "200399900011" },
];

const CATEGORIES = ["All", "Announcing", "Debating", "Creative Writing", "Photography", "Short Film"];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredContestants = MOCK_CONTESTANTS.filter(contestant => {
    const matchesSearch = 
      contestant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contestant.contestantId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contestant.nic.includes(searchQuery);
    
    const matchesCategory = selectedCategory === "All" || contestant.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const paginatedContestants = filteredContestants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <DashboardHeader onAddContestant={() => setIsModalOpen(true)} />

      {/* Filters & Search */}
      <DashboardFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={CATEGORIES}
      />

      {/* Table Section */}
      <div className="space-y-0">
        <ContestantTable contestants={paginatedContestants} />
        
        {/* Pagination */}
        <Pagination 
          currentPage={currentPage}
          totalItems={filteredContestants.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Contestant Modal */}
      <AddContestantModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}


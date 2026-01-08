import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BikeCard } from './components/BikeCard';
import type { Bike } from './types';
import { Search } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import { Toaster } from 'sonner';

function App() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchBikes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/bikes');
      setBikes(response.data);
    } catch (error) {
      console.error('Error fetching bikes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const handleRent = async (bike: Bike) => {
    // This function might be deprecated if BikeCard handles it internally 
    // but for now we keep it compatible or pass logic down if needed
    // The new BikeCard will likely handle the API call with dates
    fetchBikes();
  };

  const handleReturn = async (bike: Bike) => {
    // Legacy simple return, but now we use Admin or time-based auto expiry?
    // Keeping it for safety, though UI might hide it.
    try {
      await axios.post('http://localhost:3000/api/rentals/end', { bikeId: bike.id });
      fetchBikes();
    } catch (error) {
      alert('Failed to return bike');
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(bikes.map(b => b.category));
    return ['All', ...Array.from(cats)];
  }, [bikes]);

  const filteredBikes = useMemo(() => {
    return bikes.filter(bike => {
      const matchesSearch = bike.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || bike.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [bikes, searchTerm, selectedCategory]);

  return (
    <Router>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={
          <div className="min-h-screen bg-gray-50/50">
            <Navbar />
            <Hero />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-20 relative z-30">

              {/* Filters & Search Bar */}
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">

                  {/* Search */}
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search for a bike..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  {/* Category Tags */}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === cat
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {selectedCategory === 'All' ? 'Our Fleet' : `${selectedCategory} Bikes`}
                  <span className="ml-3 text-lg font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    {filteredBikes.length}
                  </span>
                </h2>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full opacity-50"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                </div>
              ) : filteredBikes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredBikes.map((bike) => (
                    <BikeCard
                      key={bike.id}
                      bike={bike}
                      onRent={handleRent}
                      onReturn={handleReturn}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                  <p className="text-gray-500 text-lg">No bikes found matching your criteria.</p>
                  <button
                    onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                    className="mt-4 text-indigo-600 font-semibold hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </main>

            <footer className="bg-white border-t border-gray-200 py-12 mt-12 text-center">
              <p className="text-gray-500">© 2026 RideAway. All rights reserved.</p>
            </footer>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;

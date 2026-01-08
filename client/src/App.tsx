import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from './components/Navbar';
import { BikeCard } from './components/BikeCard';
import { Bike } from './types';

function App() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

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
    try {
      await axios.post('http://localhost:3000/api/rentals/start', { bikeId: bike.id });
      fetchBikes(); // Refresh list
    } catch (error) {
      alert('Failed to rent bike');
    }
  };

  const handleReturn = async (bike: Bike) => {
    try {
      await axios.post('http://localhost:3000/api/rentals/end', { bikeId: bike.id });
      fetchBikes(); // Refresh list
    } catch (error) {
      alert('Failed to return bike');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Bikes</h1>
          <p className="mt-2 text-gray-600">Choose your perfect ride for the day.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bikes.map((bike) => (
              <BikeCard
                key={bike.id}
                bike={bike}
                onRent={handleRent}
                onReturn={handleReturn}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

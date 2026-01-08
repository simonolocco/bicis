import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { Rental, Bike } from '../types';
import { Navbar } from './Navbar';

interface RentalWithBike extends Rental {
    bike: Bike;
}

const AdminDashboard: React.FC = () => {
    const [rentals, setRentals] = useState<RentalWithBike[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRentals();
    }, []);

    const fetchRentals = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/rentals/all');
            setRentals(response.data);
        } catch (error) {
            console.error('Error fetching rentals:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Force opaque navbar style by passing a prop or just relying on its scroll logic (it starts transparent) 
                Actually, Navbar logic is scroll-based. We might want a 'always dark' mode for it, 
                OR just put a dark background behind it here. */}
            <div className="bg-gray-900 pb-20">
                <Navbar />
                <div className="pt-32 container mx-auto px-6">
                    <h1 className="text-4xl font-bold text-white mb-2">My Rentals</h1>
                    <p className="text-gray-400">Manage and view all bike rentals.</p>
                </div>
            </div>

            <main className="container mx-auto px-6 -mt-10 relative z-10 pb-20">
                {loading ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading rentals...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rental ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bike</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cost</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {rentals.map((rental) => {
                                        const isActive = !rental.endTime;
                                        return (
                                            <tr key={rental.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">#{rental.id}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs mr-3">
                                                            {(rental.customerName || 'G').charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-sm text-gray-900 font-medium">{rental.customerName || 'Guest User'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{rental.bike?.name}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium text-gray-900">
                                                            {new Date(rental.startTime).toLocaleDateString()} {new Date(rental.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            to {rental.expectedEndTime ? new Date(rental.expectedEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                                    {rental.totalCost ? `$${rental.totalCost.toFixed(2)}` : '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {isActive ? (
                                                            <>
                                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                                                Active
                                                            </>
                                                        ) : 'Completed'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;

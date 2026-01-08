import React from 'react';
import { Bike } from 'lucide-react';

export const Navbar: React.FC = () => {
    return (
        <nav className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Bike className="h-8 w-8 text-indigo-600" />
                        <span className="ml-2 text-xl font-bold text-gray-900">RideAway</span>
                    </div>
                    <div className="flex items-center">
                        <button className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                            My Rentals
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

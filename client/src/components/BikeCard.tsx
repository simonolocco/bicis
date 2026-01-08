import React from 'react';
import { Bike } from '../types';
import { Clock, DollarSign } from 'lucide-react';

interface BikeCardProps {
    bike: Bike;
    onRent: (bike: Bike) => void;
    onReturn: (bike: Bike) => void;
}

export const BikeCard: React.FC<BikeCardProps> = ({ bike, onRent, onReturn }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 w-full">
                <img
                    src={bike.image}
                    alt={bike.name}
                    className="w-full h-full object-cover"
                />
                {bike.isRented && (
                    <div className="absolute top-4 right-4 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                        Rented
                    </div>
                )}
            </div>
            <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900">{bike.name}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{bike.description}</p>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-gray-700">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="font-bold text-lg">${bike.pricePerHour.toFixed(2)}</span>
                        <span className="text-sm text-gray-500 ml-1">/ hour</span>
                    </div>
                </div>

                <div className="mt-5">
                    {bike.isRented ? (
                        <button
                            onClick={() => onReturn(bike)}
                            className="w-full py-2.5 px-4 rounded-lg bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                            Return Bike
                        </button>
                    ) : (
                        <button
                            onClick={() => onRent(bike)}
                            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            Rent Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

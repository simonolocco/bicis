import React, { useState, useEffect, useMemo } from 'react';
import type { Bike } from '../types';
import { DollarSign, Clock, Calendar, AlertCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { toast } from 'sonner';

interface BikeCardProps {
    bike: Bike;
    onRent: (bike: Bike) => void;
    onReturn: (bike: Bike) => void;
}

export const BikeCard: React.FC<BikeCardProps> = ({ bike, onRent, onReturn }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(() => {
        const date = new Date();
        date.setMinutes(date.getMinutes() + 30);
        return date;
    });
    const [customerName, setCustomerName] = useState('');
    const [existingRentals, setExistingRentals] = useState<any[]>([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);

    // Fetch existing rentals for this bike to exclude times
    useEffect(() => {
        if (isModalOpen) {
            setLoadingAvailability(true);
            axios.get(`http://localhost:3000/api/rentals/bike/${bike.id}`)
                .then(res => {
                    setExistingRentals(res.data);
                })
                .catch(err => {
                    console.error(err);
                    toast.error("Failed to load availability");
                })
                .finally(() => setLoadingAvailability(false));
        }
    }, [isModalOpen, bike.id]);

    const isTimeBlocked = (date: Date) => {
        return existingRentals.some(rental => {
            const start = new Date(rental.startTime);
            const end = new Date(rental.expectedEndTime);
            // Check if the specific time slot is occupied
            // Simple overlap check for the specific instance 'date'
            // We assume 'date' is a candidate start time, wait, filterTime runs for every 15/30 mins
            return date >= start && date < end;
        });
    };

    const filterTime = (date: Date) => {
        const now = new Date();
        if (date < now) return false;
        return !isTimeBlocked(date);
    };

    // Calculate booked dates to highlight them in the calendar
    const highlightDates = useMemo(() => {
        return existingRentals.map(rental => {
            // This is a simplification. Ideally we'd return a range or specific class
            // for now, just marking the start day.
            return new Date(rental.startTime);
        });
    }, [existingRentals]);

    // Simple textual list of booked slots for the selected date
    const bookedSlotsForDay = useMemo(() => {
        if (!startDate) return [];
        const dayStart = new Date(startDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(startDate);
        dayEnd.setHours(23, 59, 59, 999);

        return existingRentals
            .filter(rental => {
                const rStart = new Date(rental.startTime);
                const rEnd = new Date(rental.expectedEndTime);
                // Overlap with today
                return rStart < dayEnd && rEnd > dayStart;
            })
            .map(rental => ({
                start: new Date(rental.startTime),
                end: new Date(rental.expectedEndTime)
            }));
    }, [startDate, existingRentals]);

    const handleRentSubmit = async () => {
        if (!startDate || !endDate || !customerName) {
            toast.warning("Please fill in all fields");
            return;
        }

        if (startDate >= endDate) {
            toast.warning("End time must be after start time");
            return;
        }

        const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
        if (durationHours < 0.5) {
            toast.warning("Minimum rental duration is 30 minutes");
            return;
        }

        try {
            await axios.post('http://localhost:3000/api/rentals/start', {
                bikeId: bike.id,
                userId: 'guest',
                customerName,
                startTime: startDate,
                endTime: endDate
            });
            toast.success("Rental Confirmed!", {
                description: `Enjoy your ride with ${bike.name}`
            });
            setIsModalOpen(false);
            onRent(bike); // Refresh list
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || "Failed to rent bike.";
            toast.error(msg);
        }
    };

    return (
        <>
            <div className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full transform hover:-translate-y-2">
                <div className="relative h-64 w-full overflow-hidden">
                    <img
                        src={bike.image}
                        alt={bike.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-gray-900 shadow-sm border border-gray-200">
                            {bike.category}
                        </span>
                    </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{bike.name}</h3>
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">{bike.description}</p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100">
                        <div className="flex items-end justify-between mb-6">
                            <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Rate</p>
                                <div className="flex items-center text-indigo-600">
                                    <DollarSign className="h-5 w-5" />
                                    <span className="text-2xl font-black">{bike.pricePerHour}</span>
                                    <span className="text-sm text-gray-500 font-medium ml-1">/ hour</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full py-3 px-4 rounded-xl bg-gray-900 text-white font-bold hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all cursor-pointer"
                        >
                            Rent Now
                        </button>

                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-gray-800 relative overflow-hidden">

                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Rent {bike.name}</h2>
                                <p className="text-gray-500 mt-1">Select your preferred date and time.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow bg-gray-50"
                                        placeholder="John Doe"
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 text-indigo-500" /> Start Time
                                        </label>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date: Date | null) => setStartDate(date)}
                                            showTimeSelect
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                            minDate={new Date()}
                                            filterTime={filterTime}
                                            highlightDates={highlightDates}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none w-full bg-gray-50"
                                            placeholderText="Select start time"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                            <Clock className="w-4 h-4 mr-2 text-indigo-500" /> End Time
                                        </label>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date: Date | null) => setEndDate(date)}
                                            showTimeSelect
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                            minDate={startDate || undefined}
                                            minTime={startDate ? (endDate && startDate.toDateString() === endDate.toDateString() ? startDate : new Date(0, 0, 0, 0, 0)) : undefined}
                                            maxTime={startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 23, 59) : undefined}
                                            filterTime={filterTime}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none w-full bg-gray-50"
                                            placeholderText="Select end time"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Availability Info */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                                    <AlertCircle className="w-5 h-5 mr-2 text-indigo-500" />
                                    Availability for {startDate?.toLocaleDateString()}
                                </h3>

                                <div className="space-y-3">
                                    {loadingAvailability ? (
                                        <p className="text-sm text-gray-400 italic">Checking schedule...</p>
                                    ) : bookedSlotsForDay.length > 0 ? (
                                        <>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-2">Booked Slots</p>
                                            <div className="space-y-2">
                                                {bookedSlotsForDay.map((slot, idx) => (
                                                    <div key={idx} className="bg-white px-3 py-2 rounded-lg border border-red-100 flex items-center justify-between text-sm shadow-sm">
                                                        <span className="font-medium text-gray-600">
                                                            {slot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <span className="text-gray-400">to</span>
                                                        <span className="font-medium text-gray-600">
                                                            {slot.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full ml-2">BUSY</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-40 text-center">
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <p className="text-green-700 font-medium">Fully Available!</p>
                                            <p className="text-xs text-gray-400 mt-1">No bookings for this day yet.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-500 text-sm">Hourly Rate</span>
                                        <span className="font-bold text-gray-900">${bike.pricePerHour}/hr</span>
                                    </div>
                                    {startDate && endDate && endDate > startDate && (
                                        <div className="flex justify-between items-center text-lg">
                                            <span className="font-bold text-indigo-900">Total Est.</span>
                                            <span className="font-bold text-indigo-600">
                                                ${(((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)) * bike.pricePerHour).toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-bold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRentSubmit}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
                            >
                                Confirm Rental
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BikeCard;

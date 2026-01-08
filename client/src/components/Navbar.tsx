import React, { useState, useEffect } from 'react';
import { Bike, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMyRentals = () => {
        navigate('/admin');
        setMobileMenuOpen(false);
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/90 backdrop-blur-md shadow-md py-4'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center group cursor-pointer text-decoration-none">
                        <div className={`p-2 rounded-lg transition-colors ${scrolled ? 'bg-indigo-600 text-white' : 'bg-white/20 text-white backdrop-blur-sm'}`}>
                            <Bike className="h-6 w-6" />
                        </div>
                        <span className={`ml-3 text-2xl font-bold tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                            Ride<span className="text-indigo-500">Away</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className={`text-sm font-medium hover:text-indigo-500 transition-colors ${scrolled ? 'text-gray-700' : 'text-gray-200'}`}>
                            Bikes
                        </Link>
                        <a href="#" className={`text-sm font-medium hover:text-indigo-500 transition-colors ${scrolled ? 'text-gray-700' : 'text-gray-200'}`}>
                            Locations
                        </a>
                        <a href="#" className={`text-sm font-medium hover:text-indigo-500 transition-colors ${scrolled ? 'text-gray-700' : 'text-gray-200'}`}>
                            About
                        </a>
                        <button
                            onClick={handleMyRentals}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg transform hover:-translate-y-0.5 ${scrolled
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                                : 'bg-white text-indigo-900 hover:bg-gray-100'
                                }`}
                        >
                            My Rentals
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`p-2 rounded-md ${scrolled ? 'text-gray-900' : 'text-white'}`}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 p-4 flex flex-col space-y-4 animate-in slide-in-from-top-4 duration-200">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-indigo-600 px-2 py-1">
                        Bikes
                    </Link>
                    <a href="#" className="text-gray-700 font-medium hover:text-indigo-600 px-2 py-1">
                        Locations
                    </a>
                    <a href="#" className="text-gray-700 font-medium hover:text-indigo-600 px-2 py-1">
                        About
                    </a>
                    <button
                        onClick={handleMyRentals}
                        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200"
                    >
                        My Rentals
                    </button>
                </div>
            )}
        </nav>
    );
};

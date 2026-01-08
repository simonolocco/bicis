import React from 'react';

export const Hero: React.FC = () => {
    return (
        <div className="relative h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/40 z-10" />

            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80")'
                }}
            />

            <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
                    Ride Your <span className="text-indigo-400">Freedom</span>
                </h1>
                <p className="text-xl md:text-2xl font-light text-gray-100 mb-10 max-w-2xl mx-auto drop-shadow-md">
                    Discover the city, conquer the trails, or just enjoy the breeze.
                    Premium bikes for every journey, ready when you are.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-indigo-500/30">
                        Find Your Ride
                    </button>
                    <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full font-bold text-lg transition-all">
                        How it Works
                    </button>
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Compass, Camera, Car, Plane, Home as HomeIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
  const categories = [
    { name: 'Lodges', icon: HomeIcon, color: 'bg-blue-500' },
    { name: 'Safari Camps', icon: Compass, color: 'bg-emerald-500' },
    { name: 'Aviation Tours', icon: Plane, color: 'bg-sky-500' },
    { name: 'Car Rentals', icon: Car, color: 'bg-amber-500' },
    { name: 'Photography', icon: Camera, color: 'bg-purple-500' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=2000"
            alt="Botswana Wildlife"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight"
          >
            Discover the Heart of <span className="text-emerald-400">Botswana</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl mb-12 text-gray-200 font-light"
          >
            Explore the untamed wilderness, luxury lodges, and unforgettable safari experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search lodges, tours, or activities..."
                className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur text-gray-900 rounded-2xl shadow-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <Link
              to="/explore"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl transition-all whitespace-nowrap"
            >
              Explore Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Botswana Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From luxury accommodation to thrilling adventures, find everything you need for your perfect Botswana getaway.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="flex flex-col items-center p-8 rounded-3xl bg-gray-50 group-hover:bg-white group-hover:shadow-xl transition-all duration-300 border border-transparent group-hover:border-gray-100">
                  <div className={`p-4 rounded-2xl ${cat.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                    <cat.icon className="h-8 w-8" />
                  </div>
                  <span className="font-bold text-gray-900 text-center">{cat.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Explore</h2>
              <p className="text-gray-600">Hand-picked experiences for your journey.</p>
            </div>
            <Link to="/explore" className="text-emerald-600 font-bold hover:underline">View all</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Okavango Delta', img: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800', desc: 'A vast inland river delta in northern Botswana.' },
              { name: 'Chobe National Park', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800', desc: 'Known for its large herds of elephants and Cape buffalo.' },
              { name: 'Makgadikgadi Pans', img: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=800', desc: 'One of the largest salt flats in the world.' },
            ].map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                  <p className="text-gray-300 text-sm line-clamp-2">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

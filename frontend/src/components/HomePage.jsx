import { Bus, MapPin, Clock, CreditCard, User } from 'lucide-react';

const HomePage = ({ searchData, setSearchData, setAvailableBuses, cities, generateBuses, setError, error, navigate }) => {
  const handleSearch = (e) => {
    e.preventDefault();

    // Validation
    if (!searchData.from || !searchData.to || !searchData.date) {
      setError('Please fill in all fields');
      return;
    }
    if (searchData.from === searchData.to) {
      setError('Source and destination cannot be the same');
      return;
    }

    // Passed validation → clear error
    setError('');

    // Generate and save buses
    const buses = generateBuses(searchData.from, searchData.to);
    setAvailableBuses(buses);

    try {
      localStorage.setItem('searchData', JSON.stringify(searchData));
      localStorage.setItem('availableBuses', JSON.stringify(buses));
    } catch (err) {
      console.error('LocalStorage error:', err);
    }

    navigate('/results');
  };

  // Safer today’s date
  const today = new Date().toLocaleDateString('en-CA');

  return (
    <div className="min-h-screen bg-gray-50 home-page">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bus className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">TN Bus Booking</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/history')}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              My Bookings
            </button>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Guest User</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Travel Across Tamil Nadu</h2>
          <p className="text-xl mb-8 opacity-90">Book your bus tickets instantly</p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-4xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold mb-6 text-center">Search for Buses</h3>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <select
                  value={searchData.from}
                  onChange={(e) =>
                    setSearchData({ ...searchData, from: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Source</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <select
                  value={searchData.to}
                  onChange={(e) =>
                    setSearchData({ ...searchData, to: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Destination</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={searchData.date}
                  onChange={(e) =>
                    setSearchData({ ...searchData, date: e.target.value })
                  }
                  min={today}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Search Buses
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">500+ Routes</h3>
            <p className="text-gray-600">Connect to every major city in Tamil Nadu</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">24/7 Service</h3>
            <p className="text-gray-600">Book tickets anytime, anywhere</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <CreditCard className="w-12 h-12 text-pink-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
            <p className="text-gray-600">Safe and secure payment options</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

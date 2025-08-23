import React from 'react';

const SearchFilters = ({ filters, setFilters, onSearch, onClear, loading }) => {
  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const handleClear = () => {
    onClear();
  };

  const hasFilters = filters.title || filters.calories || filters.rating;

  return (
    <div className="filter-form">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Title Filter */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Recipe Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Search by title..."
              value={filters.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Calories Filter */}
          <div>
            <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
              Calories
            </label>
            <select
              id="calories"
              value={filters.calories}
              onChange={(e) => handleInputChange('calories', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any calories</option>
              <option value="<=200">200 or less</option>
              <option value="<=300">300 or less</option>
              <option value="<=400">400 or less</option>
              <option value="<=500">500 or less</option>
              <option value="<=600">600 or less</option>
              <option value=">=500">500 or more</option>
              <option value=">=600">600 or more</option>
              <option value=">=700">700 or more</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Rating
            </label>
            <select
              id="rating"
              value={filters.rating}
              onChange={(e) => handleInputChange('rating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any rating</option>
              <option value=">=1">1+ stars</option>
              <option value=">=2">2+ stars</option>
              <option value=">=3">3+ stars</option>
              <option value=">=4">4+ stars</option>
              <option value=">=4.5">4.5+ stars</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            ) : (
              'Search Recipes'
            )}
          </button>
          
          {hasFilters && (
            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Filter Summary */}
        {hasFilters && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Active filters:</span>
            {filters.title && <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded">Title: "{filters.title}"</span>}
            {filters.calories && <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded">Calories: {filters.calories}</span>}
            {filters.rating && <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Rating: {filters.rating}</span>}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchFilters;
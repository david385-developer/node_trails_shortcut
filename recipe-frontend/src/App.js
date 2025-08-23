import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeTable from './components/RecipeTable';
import RecipeDrawer from './components/RecipeDrawer';
import SearchFilters from './components/SearchFilters';
import Pagination from './components/Pagination';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage, setRecipesPerPage] = useState(15);
  const [totalRecipes, setTotalRecipes] = useState(0);

  // Filter state
  const [filters, setFilters] = useState({
    title: '',
    calories: '',
    rating: ''
  });
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Fetch all recipes (paginated)
  const fetchRecipes = async (page = 1, limit = 15) => {
    setLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * limit;
      const response = await axios.get(`http://localhost:3000/api/recipes/?pages=${offset}&limit=${limit}`, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        timeout: 10000
      });
      setRecipes(response.data.data || []);
      setTotalRecipes(response.data.total || 0);
      setIsSearchMode(false);
    } catch (err) {
      if (err.response?.status === 431) {
        setError('Request headers too large. Please clear your browser data and try again.');
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check if the backend server is running.');
      } else {
        setError('Failed to fetch recipes. Please make sure the backend server is running on port 3000.');
      }
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search recipes with filters
  const searchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.title) params.append('title', filters.title);
      if (filters.calories) params.append('calories', filters.calories);
      if (filters.rating) params.append('rating', filters.rating);

      const response = await axios.get(`http://localhost:3000/api/recipes/search/?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        timeout: 10000
      });
      setRecipes(response.data || []);
      setIsSearchMode(true);
      setCurrentPage(1);
    } catch (err) {
      if (err.response?.status === 431) {
        setError('Request headers too large. Please clear your browser data and try again.');
      } else if (err.code === 'ECONNABORTED') {
        setError('Search timeout. Please try again.');
      } else {
        setError('Failed to search recipes. Please make sure the backend server is running.');
      }
      console.error('Error searching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear filters and fetch all recipes
  const clearFilters = () => {
    setFilters({ title: '', calories: '', rating: '' });
    setCurrentPage(1);
    fetchRecipes(1, recipesPerPage);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (!isSearchMode) {
      fetchRecipes(page, recipesPerPage);
    }
  };

  // Handle recipes per page change
  const handleRecipesPerPageChange = (newLimit) => {
    setRecipesPerPage(newLimit);
    setCurrentPage(1);
    if (!isSearchMode) {
      fetchRecipes(1, newLimit);
    }
  };

  // Initial load
  useEffect(() => {
    fetchRecipes(currentPage, recipesPerPage);
    // eslint-disable-next-line
  }, []);

  const closeDrawer = () => setSelectedRecipe(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recipe Collection</h1>
          <p className="text-gray-600">Discover and explore delicious recipes from around the world</p>
        </header>

        {/* Search Filters */}
        <SearchFilters
          filters={filters}
          setFilters={setFilters}
          onSearch={searchRecipes}
          onClear={clearFilters}
          loading={loading}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* No Results */}
        {!loading && recipes.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {isSearchMode ? 'No recipes found matching your search criteria.' : 'No recipes available.'}
            </div>
            {isSearchMode && (
              <button
                onClick={clearFilters}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Recipes Table */}
        {!loading && recipes.length > 0 && (
          <>
            <RecipeTable
              recipes={recipes}
              onRecipeClick={setSelectedRecipe}
            />

            {/* Pagination - only show for non-search results */}
            {!isSearchMode && (
              <Pagination
                currentPage={currentPage}
                totalRecipes={totalRecipes}
                recipesPerPage={recipesPerPage}
                onPageChange={handlePageChange}
                onRecipesPerPageChange={handleRecipesPerPageChange}
              />
            )}
          </>
        )}

        {/* Recipe Detail Drawer */}
        <RecipeDrawer
          recipe={selectedRecipe}
          isOpen={!!selectedRecipe}
          onClose={closeDrawer}
        />
      </div>
    </div>
  );
}

export default App;
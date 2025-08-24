import React from 'react';
import ReactStars from 'react-rating-stars-component';

const RecipeDrawer = ({ recipe, isOpen, onClose }) => {
  if (!recipe) return null;

  const formatTime = (minutes) => {
    if (!minutes || isNaN(minutes)) return 'N/A';
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const getNutrients = () => {
    if (!recipe.nutrients) return [];
    
    let nutrients;
    try {
      nutrients = typeof recipe.nutrients === 'string' 
        ? JSON.parse(recipe.nutrients) 
        : recipe.nutrients;
    } catch (e) {
      return [];
    }

    return [
      { label: 'Calories', value: nutrients.calories },
      { label: 'Carbohydrates', value: nutrients.carbohydrateContent },
      { label: 'Cholesterol', value: nutrients.cholesterolContent },
      { label: 'Fiber', value: nutrients.fiberContent },
      { label: 'Protein', value: nutrients.proteinContent },
      { label: 'Saturated Fat', value: nutrients.saturatedFatContent },
      { label: 'Sodium', value: nutrients.sodiumContent },
      { label: 'Sugar', value: nutrients.sugarContent },
      { label: 'Fat', value: nutrients.fatContent }
    ].filter(nutrient => nutrient.value !== undefined && nutrient.value !== null);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`drawer ${isOpen ? 'open' : ''}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
                <p className="text-blue-100">{recipe.cuisine || 'Cuisine not specified'}</p>
                {recipe.rating && (
                  <div className="flex items-center mt-2">
                    <ReactStars
                      count={5}
                      value={parseFloat(recipe.rating)}
                      size={18}
                      activeColor="#ffd700"
                      edit={false}
                      isHalf={true}
                    />
                    <span className="ml-2 text-blue-100">
                      ({parseFloat(recipe.rating).toFixed(1)})
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Description */}
            {recipe.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{recipe.description}</p>
              </div>
            )}

            {/* Time Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Time Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Time:</span>
                  <span className="font-medium">
                    {(recipe.total_time && Number(recipe.total_time) > 0)
                      ? formatTime(Number(recipe.total_time))
                      : (recipe.prep_time && recipe.cook_time && Number(recipe.prep_time) > 0 && Number(recipe.cook_time) > 0)
                        ? formatTime(Number(recipe.prep_time) + Number(recipe.cook_time))
                        : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prep Time:</span>
                  <span className="font-medium">
                    {(recipe.prep_time && Number(recipe.prep_time) > 0)
                      ? formatTime(Number(recipe.prep_time))
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cook Time:</span>
                  <span className="font-medium">
                    {(recipe.cook_time && Number(recipe.cook_time) > 0)
                      ? formatTime(Number(recipe.cook_time))
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Serves:</span>
                  <span className="font-medium">{recipe.serves || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Nutrition Information */}
            {getNutrients().length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Nutrition Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <table className="nutrient-table w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Nutrient</th>
                        <th className="text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getNutrients().map((nutrient, index) => (
                        <tr key={index}>
                          <td className="text-gray-700">{nutrient.label}</td>
                          <td className="text-right font-medium">{nutrient.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeDrawer;

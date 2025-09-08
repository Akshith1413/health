import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Target, 
  TrendingUp, 
  Droplets, 
  Utensils, 
  PieChart as PieChartIcon, 
  BarChart3 as BarChartIcon, 
  Clock, 
  User, 
  BookOpen, 
  Settings 
} from 'lucide-react';

// Recharts (keep chart components clean)
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import Navbar from '../components/Navbar';
const NutritionTracker = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [nutritionalGoals, setNutritionalGoals] = useState({
    dailyCalories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
    fiber: 25,
    water: 2000
  });

  // Sample data - would come from API in real implementation
  const [foodItems] = useState([
    { id: 1, name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, servingSize: '100g' },
    { id: 2, name: 'Brown Rice', calories: 112, protein: 2.6, carbs: 22, fat: 0.9, fiber: 1.8, servingSize: '100g' },
    { id: 3, name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, servingSize: '100g' },
    { id: 4, name: 'Salmon', calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0, servingSize: '100g' },
    { id: 5, name: 'Avocado', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, servingSize: '100g' },
    { id: 6, name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, servingSize: '100g' },
    { id: 7, name: 'Almonds', calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, servingSize: '100g' },
    { id: 8, name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, servingSize: '100g' }
  ]);

  const [recipes, setRecipes] = useState([
    {
      id: 1,
      name: 'Protein Power Bowl',
      ingredients: [
        { foodItem: foodItems[0], quantity: 150 },
        { foodItem: foodItems[1], quantity: 100 },
        { foodItem: foodItems[2], quantity: 100 }
      ],
      servings: 1,
      nutrition: { calories: 395, protein: 48, carbs: 29, fat: 5.9, fiber: 4.4 }
    },
    {
      id: 2,
      name: 'Salmon Avocado Bowl',
      ingredients: [
        { foodItem: foodItems[3], quantity: 120 },
        { foodItem: foodItems[4], quantity: 80 },
        { foodItem: foodItems[7], quantity: 150 }
      ],
      servings: 1,
      nutrition: { calories: 504, protein: 28, carbs: 39, fat: 26.4, fiber: 9.5 }
    }
  ]);

  // Sample weekly data for charts
  const weeklyData = [
    { day: 'Mon', calories: 1950, protein: 145, carbs: 240, fat: 65, water: 2200 },
    { day: 'Tue', calories: 2100, protein: 160, carbs: 260, fat: 70, water: 1800 },
    { day: 'Wed', calories: 1850, protein: 140, carbs: 220, fat: 60, water: 2400 },
    { day: 'Thu', calories: 2050, protein: 155, carbs: 250, fat: 68, water: 2000 },
    { day: 'Fri', calories: 2200, protein: 165, carbs: 270, fat: 75, water: 2100 },
    { day: 'Sat', calories: 2300, protein: 170, carbs: 290, fat: 80, water: 1900 },
    { day: 'Sun', calories: 1900, protein: 135, carbs: 230, fat: 62, water: 2300 }
  ];

  // Calculate daily totals
  const dailyTotals = meals.reduce((acc, meal) => {
    const mealNutrition = meal.items?.reduce((mealAcc, item) => ({
      calories: mealAcc.calories + (item.calories || 0) * (item.quantity || 1),
      protein: mealAcc.protein + (item.protein || 0) * (item.quantity || 1),
      carbs: mealAcc.carbs + (item.carbs || 0) * (item.quantity || 1),
      fat: mealAcc.fat + (item.fat || 0) * (item.quantity || 1),
      fiber: mealAcc.fiber + (item.fiber || 0) * (item.quantity || 1)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }) || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    
    return {
      calories: acc.calories + mealNutrition.calories,
      protein: acc.protein + mealNutrition.protein,
      carbs: acc.carbs + mealNutrition.carbs,
      fat: acc.fat + mealNutrition.fat,
      fiber: acc.fiber + mealNutrition.fiber
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

  // Macronutrient pie chart data
  const macroData = [
    { name: 'Protein', value: dailyTotals.protein * 4, fill: '#3b82f6' },
    { name: 'Carbs', value: dailyTotals.carbs * 4, fill: '#10b981' },
    { name: 'Fat', value: dailyTotals.fat * 9, fill: '#f59e0b' }
  ];

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const addMeal = (mealData) => {
    setMeals([...meals, { ...mealData, id: Date.now(), date: selectedDate }]);
  };

  const addWaterIntake = (amount) => {
    setWaterIntake(prev => prev + amount);
  };

  const MealForm = ({ onAdd, onClose }) => {
    const [mealName, setMealName] = useState('');
    const [mealType, setMealType] = useState('breakfast');
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFoods = foodItems.filter(food => 
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addFoodItem = (food) => {
      const existingItem = selectedItems.find(item => item.id === food.id);
      if (existingItem) {
        setSelectedItems(selectedItems.map(item => 
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setSelectedItems([...selectedItems, { ...food, quantity: 1 }]);
      }
    };

    const updateQuantity = (id, quantity) => {
      setSelectedItems(selectedItems.map(item => 
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onAdd({
        name: mealName,
        type: mealType,
        items: selectedItems,
        time: new Date().toLocaleTimeString()
      });
      onClose();
    };

    return (
      <div className="fixed text-gray-600 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4 dark:text-white">Add New Meal</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Meal Name</label>
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Search Foods</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="Search foods..."
                />
              </div>
            </div>

            <div className="max-h-40 overflow-y-auto border rounded-lg dark:border-gray-600">
              {filteredFoods.map(food => (
                <div key={food.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b dark:border-gray-600 last:border-b-0"
                     onClick={() => addFoodItem(food)}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium dark:text-white">{food.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{food.calories} cal per {food.servingSize}</div>
                    </div>
                    <Plus className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
              ))}
            </div>

            {selectedItems.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 dark:text-white">Selected Items</h4>
                <div className="space-y-2">
                  {selectedItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <span className="dark:text-white">{item.name}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center dark:text-white"
                        >
                          -
                        </button>
                        <span className="w-8 text-center dark:text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center dark:text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={!mealName || selectedItems.length === 0}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-600"
              >
                Add Meal
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const RecipeForm = ({ onAdd, onClose }) => {
    const [recipeName, setRecipeName] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [servings, setServings] = useState(1);
    const [instructions, setInstructions] = useState(['']);

    const addIngredient = (food) => {
      const existingIngredient = ingredients.find(ing => ing.foodItem.id === food.id);
      if (!existingIngredient) {
        setIngredients([...ingredients, { foodItem: food, quantity: 1, unit: 'serving' }]);
      }
    };

    const updateIngredientQuantity = (index, quantity) => {
      setIngredients(ingredients.map((ing, i) => 
        i === index ? { ...ing, quantity: Math.max(0, quantity) } : ing
      ).filter(ing => ing.quantity > 0));
    };

    const addInstruction = () => {
      setInstructions([...instructions, '']);
    };

    const updateInstruction = (index, value) => {
      setInstructions(instructions.map((inst, i) => i === index ? value : inst));
    };

    const calculateNutrition = () => {
      const total = ingredients.reduce((acc, ing) => ({
        calories: acc.calories + (ing.foodItem.calories * ing.quantity),
        protein: acc.protein + (ing.foodItem.protein * ing.quantity),
        carbs: acc.carbs + (ing.foodItem.carbs * ing.quantity),
        fat: acc.fat + (ing.foodItem.fat * ing.quantity),
        fiber: acc.fiber + (ing.foodItem.fiber * ing.quantity)
      }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

      return {
        calories: Math.round(total.calories / servings),
        protein: Math.round(total.protein / servings),
        carbs: Math.round(total.carbs / servings),
        fat: Math.round(total.fat / servings),
        fiber: Math.round(total.fiber / servings)
      };
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const nutrition = calculateNutrition();
      const newRecipe = {
        id: Date.now(),
        name: recipeName,
        description,
        ingredients,
        servings,
        instructions: instructions.filter(inst => inst.trim()),
        nutrition
      };
      setRecipes([...recipes, newRecipe]);
      onAdd(newRecipe);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4 dark:text-white">Create New Recipe</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Recipe Name</label>
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Servings</label>
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                rows="2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Add Ingredients</label>
                <div className="max-h-60 overflow-y-auto border rounded-lg dark:border-gray-600">
                  {foodItems.map(food => (
                    <div key={food.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b dark:border-gray-600 last:border-b-0"
                         onClick={() => addIngredient(food)}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium dark:text-white">{food.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{food.calories} cal per {food.servingSize}</div>
                        </div>
                        <Plus className="h-4 w-4 text-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Recipe Ingredients</label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <span className="text-sm dark:text-white">{ingredient.foodItem.name}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => updateIngredientQuantity(index, ingredient.quantity - 0.5)}
                          className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm dark:text-white"
                        >
                          -
                        </button>
                        <span className="w-12 text-center text-sm dark:text-white">{ingredient.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateIngredientQuantity(index, ingredient.quantity + 0.5)}
                          className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm dark:text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">Instructions</label>
              <div className="space-y-2">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-sm font-medium dark:text-white">{index + 1}.</span>
                    <input
                      type="text"
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="Enter instruction step..."
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addInstruction}
                  className="text-blue-500 text-sm hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  + Add Step
                </button>
              </div>
            </div>

            {ingredients.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2 dark:text-white">Estimated Nutrition (per serving)</h4>
                <div className="grid grid-cols-5 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium dark:text-white">{calculateNutrition().calories}</div>
                    <div className="text-gray-600 dark:text-gray-400">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium dark:text-white">{calculateNutrition().protein}g</div>
                    <div className="text-gray-600 dark:text-gray-400">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium dark:text-white">{calculateNutrition().carbs}g</div>
                    <div className="text-gray-600 dark:text-gray-400">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium dark:text-white">{calculateNutrition().fat}g</div>
                    <div className="text-gray-600 dark:text-gray-400">Fat</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium dark:text-white">{calculateNutrition().fiber}g</div>
                    <div className="text-gray-600 dark:text-gray-400">Fiber</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={!recipeName || ingredients.length === 0}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-600"
              >
                Create Recipe
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const GoalsForm = ({ goals, onUpdate, onClose }) => {
    const [formGoals, setFormGoals] = useState(goals);

    const handleSubmit = (e) => {
      e.preventDefault();
      onUpdate(formGoals);
      onClose();
    };

    return (
      <div className="fixed text-gray-600 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
          <h3 className="text-xl font-bold mb-4 dark:text-white">Update Nutritional Goals</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Daily Calories</label>
              <input
                type="number"
                value={formGoals.dailyCalories}
                onChange={(e) => setFormGoals({...formGoals, dailyCalories: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Protein (g)</label>
              <input
                type="number"
                value={formGoals.protein}
                onChange={(e) => setFormGoals({...formGoals, protein: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Carbs (g)</label>
              <input
                type="number"
                value={formGoals.carbs}
                onChange={(e) => setFormGoals({...formGoals, carbs: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Fat (g)</label>
              <input
                type="number"
                value={formGoals.fat}
                onChange={(e) => setFormGoals({...formGoals, fat: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Fiber (g)</label>
              <input
                type="number"
                value={formGoals.fiber}
                onChange={(e) => setFormGoals({...formGoals, fiber: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Water (ml)</label>
              <input
                type="number"
                value={formGoals.water}
                onChange={(e) => setFormGoals({...formGoals, water: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                min="0"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Update Goals
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const [showMealForm, setShowMealForm] = useState(false);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [showGoalsForm, setShowGoalsForm] = useState(false);
const theme = localStorage.getItem("theme"); 
  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <Navbar />
      <br />
      <br />
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Nutrition Tracker</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your daily nutrition and achieve your health goals</p>
          </div>
          <div className="flex text-black items-center space-x-4 mt-4 md:mt-0">
            
  <input
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    className="px-4 py-2 text-black border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
    style={{ colorScheme: theme === "dark" ? "dark" : "light" }} // Ensures white theme styling
  />
  
            <button
              onClick={() => setShowGoalsForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
            >
              <Target className="h-4 w-4" />
              <span>Goals</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6">
        <div className="flex flex-wrap border-b dark:border-gray-700">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChartIcon },
            { id: 'meals', label: 'Meals', icon: Utensils },
            { id: 'recipes', label: 'Recipes', icon: BookOpen },
            { id: 'reports', label: 'Reports', icon: TrendingUp },
            { id: 'planning', label: 'Meal Planning', icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium flex items-center space-x-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white text-gray-600 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Calories</p>
                  <p className="text-2xl mb-3 text-black font-bold dark:text-white">{Math.round(dailyTotals.calories)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">/ {nutritionalGoals.dailyCalories}</p>
                </div>
                <div className={`w-12 h-12 text-gray-600 rounded-full flex items-center justify-center ${
                  dailyTotals.calories >= nutritionalGoals.dailyCalories ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  <Target className={`h-6 w-6 ${
                    dailyTotals.calories >= nutritionalGoals.dailyCalories ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                  }`} />
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (dailyTotals.calories / nutritionalGoals.dailyCalories) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Protein</p>
                  <p className="text-2xl text-black mb-3 font-bold dark:text-white">{Math.round(dailyTotals.protein)}g</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">/ {nutritionalGoals.protein}g</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  dailyTotals.protein >= nutritionalGoals.protein ? 'bg-green-100 dark:bg-green-900/30' : 'bg-purple-100 dark:bg-purple-900/30'
                }`}>
                  <User className={`h-6 w-6 ${
                    dailyTotals.protein >= nutritionalGoals.protein ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'
                  }`} />
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (dailyTotals.protein / nutritionalGoals.protein) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Carbs</p>
                  <p className="text-2xl text-black mb-3 font-bold dark:text-white">{Math.round(dailyTotals.carbs)}g</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">/ {nutritionalGoals.carbs}g</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  dailyTotals.carbs >= nutritionalGoals.carbs ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
                }`}>
                  <Settings className={`h-6 w-6 ${
                    dailyTotals.carbs >= nutritionalGoals.carbs ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                  }`} />
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (dailyTotals.carbs / nutritionalGoals.carbs) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fat</p>
                  <p className="text-2xl text-black mb-3 font-bold dark:text-white">{Math.round(dailyTotals.fat)}g</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">/ {nutritionalGoals.fat}g</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  dailyTotals.fat >= nutritionalGoals.fat ? 'bg-green-100 dark:bg-green-900/30' : 'bg-orange-100 dark:bg-orange-900/30'
                }`}>
                  <Droplets className={`h-6 w-6 ${
                    dailyTotals.fat >= nutritionalGoals.fat ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                  }`} />
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (dailyTotals.fat / nutritionalGoals.fat) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Water</p>
                  <p className="text-2xl text-black mb-3 font-bold dark:text-white">{waterIntake}ml</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">/ {nutritionalGoals.water}ml</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  waterIntake >= nutritionalGoals.water ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  <Droplets className={`h-6 w-6 ${
                    waterIntake >= nutritionalGoals.water ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                  }`} />
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (waterIntake / nutritionalGoals.water) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Macronutrient Distribution */}
            <div className="bg-white text-gray-600 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4 dark:text-white">Macronutrient Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${Math.round(value)} cal`, 'Calories']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Calorie Trend */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4 dark:text-white">Weekly Calorie Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis dataKey="day" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }} 
                    itemStyle={{ color: '#F9FAFB' }}
                  />
                  <Line type="monotone" dataKey="calories" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="protein" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Water Intake Widget */}
          <div className="bg-white text-gray-600 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold dark:text-white">Water Intake</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => addWaterIntake(250)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  +250ml
                </button>
                <button
                  onClick={() => addWaterIntake(500)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  +500ml
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (waterIntake / nutritionalGoals.water) * 100)}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {waterIntake} / {nutritionalGoals.water} ml
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Meals Tab */}
      {activeTab === 'meals' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl text-black font-bold dark:text-white">Today's Meals</h2>
            <button
              onClick={() => setShowMealForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Meal</span>
            </button>
          </div>

          <div className="grid gap-4">
            {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
              const mealTypeData = meals.filter(meal => meal.type === mealType);
              const mealTotals = mealTypeData.reduce((acc, meal) => {
                const nutrition = meal.items?.reduce((mealAcc, item) => ({
                  calories: mealAcc.calories + (item.calories || 0) * (item.quantity || 1),
                  protein: mealAcc.protein + (item.protein || 0) * (item.quantity || 1),
                  carbs: mealAcc.carbs + (item.carbs || 0) * (item.quantity || 1),
                  fat: mealAcc.fat + (item.fat || 0) * (item.quantity || 1)
                }), { calories: 0, protein: 0, carbs: 0, fat: 0 }) || { calories: 0, protein: 0, carbs: 0, fat: 0 };
                return {
                  calories: acc.calories + nutrition.calories,
                  protein: acc.protein + nutrition.protein,
                  carbs: acc.carbs + nutrition.carbs,
                  fat: acc.fat + nutrition.fat
                };
              }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

              return (
                <div key={mealType} className="bg-white text-gray-600 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold capitalize dark:text-white">{mealType}</h3>
                    <div className="text-right">
                      <div className="text-lg font-bold dark:text-white">{Math.round(mealTotals.calories)} cal</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        P: {Math.round(mealTotals.protein)}g | C: {Math.round(mealTotals.carbs)}g | F: {Math.round(mealTotals.fat)}g
                      </div>
                    </div>
                  </div>
                  
                  {mealTypeData.length === 0 ? (
                    <div className="text-gray-500 dark:text-gray-500 text-center py-8">
                      No {mealType} added yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {mealTypeData.map(meal => (
                        <div key={meal.id} className="border dark:border-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium dark:text-white">{meal.name}</h4>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {meal.items?.map((item, index) => (
                                  <span key={index}>
                                    {item.name} ({item.quantity}x)
                                    {index < meal.items.length - 1 && ', '}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right text-sm">
                              <div className="font-medium dark:text-white">{meal.time}</div>
                              <div className="text-gray-600 dark:text-gray-400">
                                {Math.round(meal.items?.reduce((acc, item) => acc + (item.calories || 0) * (item.quantity || 1), 0))} cal
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recipes Tab */}
      {activeTab === 'recipes' && (
        <div className="space-y-6">
          <div className="flex text-gray-600 justify-between items-center">
            <h2 className="text-2xl font-bold dark:text-white">My Recipes</h2>
            <button
              onClick={() => setShowRecipeForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Recipe</span>
            </button>
          </div>

          <div className="grid text-gray-600 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map(recipe => (
              <div key={recipe.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold mb-2 dark:text-white">{recipe.name}</h3>
                {recipe.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{recipe.description}</p>
                )}
                
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Nutrition per serving:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="dark:text-white">Calories: <span className="font-medium">{recipe.nutrition.calories}</span></div>
                    <div className="dark:text-white">Protein: <span className="font-medium">{recipe.nutrition.protein}g</span></div>
                    <div className="dark:text-white">Carbs: <span className="font-medium">{recipe.nutrition.carbs}g</span></div>
                    <div className="dark:text-white">Fat: <span className="font-medium">{recipe.nutrition.fat}g</span></div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <div className="font-medium mb-1 dark:text-white">Ingredients:</div>
                  <ul className="list-disc list-inside">
                    {recipe.ingredients.map((ing, index) => (
                      <li key={index} className="dark:text-gray-300">{ing.foodItem.name} ({ing.quantity} {ing.unit})</li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{recipe.servings} servings</span>
                  <button
                    onClick={() => {
                      // Add recipe as a meal
                      const mealData = {
                        name: recipe.name,
                        type: 'lunch',
                        items: [{ ...recipe.nutrition, name: recipe.name, quantity: 1 }],
                        time: new Date().toLocaleTimeString()
                      };
                      addMeal(mealData);
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Add to Meal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="text-gray-600 space-y-6">
          <h2 className="text-2xl font-bold dark:text-white">Nutritional Reports</h2>
          
          {/* Weekly Overview */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Weekly Overview</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }} 
                  itemStyle={{ color: '#F9FAFB' }}
                />
                <Legend />
                <Bar dataKey="calories" fill="#3b82f6" name="Calories" />
                <Bar dataKey="protein" fill="#10b981" name="Protein (x10)" />
                <Bar dataKey="carbs" fill="#f59e0b" name="Carbs (x10)" />
                <Bar dataKey="fat" fill="#ef4444" name="Fat (x10)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Macronutrient Balance Over Time */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
  <h3 className="text-lg font-bold mb-4 dark:text-white">Macronutrient Trends</h3>
  <ResponsiveContainer width="100%" height={400}>
    <AreaChart data={weeklyData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
      <XAxis dataKey="day" stroke="#9CA3AF" />
      <YAxis stroke="#9CA3AF" />
      <Tooltip 
        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
        itemStyle={{ color: '#F9FAFB' }}
      />
      <Legend />
      <Area type="monotone" dataKey="protein" stackId="1" stroke="#10b981" fill="#10b981" />
      <Area type="monotone" dataKey="carbs" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
      <Area type="monotone" dataKey="fat" stackId="1" stroke="#ef4444" fill="#ef4444" />
    </AreaChart>
  </ResponsiveContainer>
</div>


          {/* Goal Achievement Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(nutritionalGoals).filter(([key]) => key !== 'water').map(([key, goal]) => {
              const current = dailyTotals[key] || 0;
              const percentage = (current / goal) * 100;
              return (
                <div key={key} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                  <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">{key}</div>
                  <div className="text-2xl font-bold dark:text-white">{Math.round(current)}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">Goal: {goal}</div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          percentage >= 100 ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{Math.round(percentage)}%</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Water Intake Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Water Intake Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  formatter={(value) => [`${value} ml`, 'Water']} 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }} 
                  itemStyle={{ color: '#F9FAFB' }}
                />
                <Line type="monotone" dataKey="water" stroke="#06b6d4" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Meal Planning Tab */}
      {activeTab === 'planning' && (
        <div className="text-gray-600 space-y-6">
          <h2 className="text-2xl font-bold dark:text-white">Meal Planning</h2>
          
          {/* Weekly Meal Planner */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Weekly Meal Plan</h3>
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIndex) => (
                <div key={day} className="border dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-center mb-3 dark:text-white">{day}</h4>
                  <div className="space-y-2">
                    {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
                      <div key={meal} className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-sm">
                        <div className="font-medium text-gray-600 dark:text-gray-300">{meal}</div>
                        <div className="text-gray-500 dark:text-gray-400 mt-1">
                          {dayIndex === 0 && meal === 'Breakfast' && 'Protein Power Bowl'}
                          {dayIndex === 1 && meal === 'Lunch' && 'Salmon Avocado Bowl'}
                          {!((dayIndex === 0 && meal === 'Breakfast') || (dayIndex === 1 && meal === 'Lunch')) && 'Click to add'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meal Templates */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Meal Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'High Protein Plan', calories: '2200 cal/day', protein: '180g protein' },
                { name: 'Balanced Diet', calories: '2000 cal/day', protein: '150g protein' },
                { name: 'Low Carb Plan', calories: '1800 cal/day', protein: '160g protein' }
              ].map((template, index) => (
                <div key={index} className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <h4 className="font-bold mb-2 dark:text-white">{template.name}</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div>{template.calories}</div>
                    <div>{template.protein}</div>
                  </div>
                  <button className="mt-3 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Shopping List Generator */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Shopping List</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2 dark:text-white">This Week's Ingredients</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded dark:bg-gray-700" />
                    <span className="dark:text-gray-300">Chicken Breast (1.5 kg)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded dark:bg-gray-700" />
                    <span className="dark:text-gray-300">Brown Rice (500g)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded dark:bg-gray-700" />
                    <span className="dark:text-gray-300">Broccoli (3 heads)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded dark:bg-gray-700" />
                    <span className="dark:text-gray-300">Salmon (800g)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded dark:bg-gray-700" />
                    <span className="dark:text-gray-300">Avocados (4 pieces)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 dark:text-white">Estimated Cost</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between dark:text-gray-300">
                    <span>Proteins</span>
                    <span>$25.00</span>
                  </div>
                  <div className="flex justify-between dark:text-gray-300">
                    <span>Vegetables</span>
                    <span>$12.00</span>
                  </div>
                  <div className="flex justify-between dark:text-gray-300">
                    <span>Grains</span>
                    <span>$8.00</span>
                  </div>
                  <div className="flex justify-between font-bold border-t dark:border-gray-700 pt-1 dark:text-white">
                    <span>Total</span>
                    <span>$45.00</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Generate Shopping List
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showMealForm && (
        <MealForm
          onAdd={addMeal}
          onClose={() => setShowMealForm(false)}
        />
      )}

      {showRecipeForm && (
        <RecipeForm
          onAdd={(recipe) => console.log('Recipe added:', recipe)}
          onClose={() => setShowRecipeForm(false)}
        />
      )}

      {showGoalsForm && (
        <GoalsForm
          goals={nutritionalGoals}
          onUpdate={setNutritionalGoals}
          onClose={() => setShowGoalsForm(false)}
        />
      )}
    </div>
  );
};

export default NutritionTracker;
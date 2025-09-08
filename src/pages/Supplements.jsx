import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart, Legend } from 'recharts';
import {
  Plus, Search, Filter, Calendar, Clock, AlertTriangle, TrendingUp, DollarSign,
  Activity, CheckCircle, XCircle, Bell, Edit, Trash2, Eye, User, Pill, Sun, Moon,
  ChevronDown, ChevronUp, Settings, BarChart3, Download, Upload, Heart, Brain, Zap,
  Coffee, ArrowLeft // 👈 Add ArrowLeft here
} from 'lucide-react';

// Theme Context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; 
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const SupplementManagementSystem = () => {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [supplements, setSupplements] = useState([]);
  const [userSupplements, setUserSupplements] = useState([]);
  const [intakeHistory, setIntakeHistory] = useState([]);
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [selectedSupplement, setSelectedSupplement] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [expandedSections, setExpandedSections] = useState({
    reminders: true,
    interactions: true,
    charts: true
  });
  const { theme, toggleTheme } = useTheme();

  // Sample data
  useEffect(() => {
    // Initialize with sample data
    const sampleSupplements = [
      {
        _id: '1',
        name: 'Vitamin D3',
        brand: 'Nature Made',
        type: 'Vitamin',
        dosageUnit: 'IU',
        servingSize: 2000,
        description: 'Supports bone health and immune function',
        potentialBenefits: ['Bone health', 'Immune support', 'Mood regulation'],
        potentialSideEffects: ['Nausea', 'Kidney stones (high doses)']
      },
      {
        _id: '2',
        name: 'Omega-3',
        brand: 'Nordic Naturals',
        type: 'Other',
        dosageUnit: 'mg',
        servingSize: 1000,
        description: 'Essential fatty acids for heart and brain health',
        potentialBenefits: ['Heart health', 'Brain function', 'Anti-inflammatory'],
        potentialSideEffects: ['Fishy taste', 'Digestive issues']
      },
      {
        _id: '3',
        name: 'Magnesium',
        brand: 'Thorne',
        type: 'Mineral',
        dosageUnit: 'mg',
        servingSize: 400,
        description: 'Essential mineral for muscle and nerve function',
        potentialBenefits: ['Muscle relaxation', 'Better sleep', 'Heart health'],
        potentialSideEffects: ['Diarrhea', 'Stomach upset']
      },
      {
        _id: '4',
        name: 'Vitamin B12',
        brand: 'Jarrow Formulas',
        type: 'Vitamin',
        dosageUnit: 'mcg',
        servingSize: 1000,
        description: 'Supports energy production and nervous system health',
        potentialBenefits: ['Energy boost', 'Nerve function', 'Red blood cell formation'],
        potentialSideEffects: ['Mild diarrhea', 'Itching']
      }
    ];

    const sampleUserSupplements = [
      {
        _id: 'us1',
        supplementId: '1',
        supplement: sampleSupplements[0],
        dosage: 2000,
        frequency: 'Once Daily',
        specificTimes: ['08:00'],
        withFood: false,
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        reason: 'Vitamin D deficiency',
        status: 'Active',
        cost: { price: 15.99, quantity: 90, currency: 'USD' }
      },
      {
        _id: 'us2',
        supplementId: '2',
        supplement: sampleSupplements[1],
        dosage: 1000,
        frequency: 'Twice Daily',
        specificTimes: ['08:00', '20:00'],
        withFood: true,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        reason: 'Heart health support',
        status: 'Active',
        cost: { price: 29.99, quantity: 60, currency: 'USD' }
      },
      {
        _id: 'us3',
        supplementId: '4',
        supplement: sampleSupplements[3],
        dosage: 1000,
        frequency: 'Once Daily',
        specificTimes: ['12:00'],
        withFood: true,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        reason: 'Energy support',
        status: 'Active',
        cost: { price: 12.99, quantity: 60, currency: 'USD' }
      }
    ];

    // Generate sample intake history
    const sampleIntakeHistory = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      
      // Vitamin D intake
      if (Math.random() > 0.1) { // 90% adherence
        sampleIntakeHistory.push({
          _id: `intake_vd_${i}`,
          userSupplementId: 'us1',
          supplement: 'Vitamin D3',
          takenAt: new Date(date.setHours(8, 0)),
          dosageTaken: 2000,
          wasTaken: true
        });
      }

      // Omega-3 morning intake
      if (Math.random() > 0.15) { // 85% adherence
        sampleIntakeHistory.push({
          _id: `intake_omega_morning_${i}`,
          userSupplementId: 'us2',
          supplement: 'Omega-3',
          takenAt: new Date(date.setHours(8, 0)),
          dosageTaken: 1000,
          wasTaken: true
        });
      }

      // Omega-3 evening intake
      if (Math.random() > 0.2) { // 80% adherence
        sampleIntakeHistory.push({
          _id: `intake_omega_evening_${i}`,
          userSupplementId: 'us2',
          supplement: 'Omega-3',
          takenAt: new Date(date.setHours(20, 0)),
          dosageTaken: 1000,
          wasTaken: true
        });
      }

      // Vitamin B12 intake
      if (Math.random() > 0.05) { // 95% adherence
        sampleIntakeHistory.push({
          _id: `intake_b12_${i}`,
          userSupplementId: 'us3',
          supplement: 'Vitamin B12',
          takenAt: new Date(date.setHours(12, 0)),
          dosageTaken: 1000,
          wasTaken: true
        });
      }
    }

    // Generate sample health metrics
    const sampleHealthMetrics = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      sampleHealthMetrics.push({
        _id: `hm_energy_${i}`,
        type: 'Energy',
        value: Math.floor(Math.random() * 4) + 6, // 6-10 scale
        recordedAt: date,
        date: date.toISOString().split('T')[0]
      });
      sampleHealthMetrics.push({
        _id: `hm_mood_${i}`,
        type: 'Mood',
        value: Math.floor(Math.random() * 3) + 7, // 7-10 scale
        recordedAt: date,
        date: date.toISOString().split('T')[0]
      });
      sampleHealthMetrics.push({
        _id: `hm_sleep_${i}`,
        type: 'Sleep',
        value: Math.floor(Math.random() * 3) + 6, // 6-9 scale
        recordedAt: date,
        date: date.toISOString().split('T')[0]
      });
    }

    const sampleInteractions = [
      {
        _id: 'int1',
        supplementsInvolved: ['Vitamin D3', 'Magnesium'],
        severity: 'Moderate',
        description: 'Vitamin D and Magnesium work synergistically for bone health',
        recommendation: 'Consider taking both for optimal bone health benefits',
        acknowledged: false
      },
      {
        _id: 'int2',
        supplementsInvolved: ['Omega-3', 'Vitamin E'],
        severity: 'Mild',
        description: 'Omega-3 may increase vitamin E requirements',
        recommendation: 'Ensure adequate vitamin E intake if taking high-dose omega-3',
        acknowledged: true
      }
    ];

    setSupplements(sampleSupplements);
    setUserSupplements(sampleUserSupplements);
    setIntakeHistory(sampleIntakeHistory);
    setHealthMetrics(sampleHealthMetrics);
    setInteractions(sampleInteractions);
  }, []);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle intake recording
  const handleIntakeRecord = (supplementId, taken = true, notes = '') => {
    const newIntake = {
      _id: `intake_${Date.now()}`,
      userSupplementId: supplementId,
      supplement: userSupplements.find(s => s._id === supplementId)?.supplement?.name || 'Unknown',
      takenAt: new Date(),
      dosageTaken: userSupplements.find(s => s._id === supplementId)?.dosage || 0,
      wasTaken: taken,
      notes: notes
    };
    
    setIntakeHistory(prev => [newIntake, ...prev]);
    setShowIntakeModal(false);
  };

  // Handle interaction acknowledgment
  const handleAcknowledgeInteraction = (interactionId) => {
    setInteractions(prev => 
      prev.map(interaction => 
        interaction._id === interactionId 
          ? { ...interaction, acknowledged: true } 
          : interaction
      )
    );
  };

  // Analytics calculations
  const calculateAdherence = () => {
    const adherenceData = userSupplements.map(supp => {
      const expectedIntakes = 30 * (supp.frequency === 'Once Daily' ? 1 : supp.frequency === 'Twice Daily' ? 2 : 3);
      const actualIntakes = intakeHistory.filter(intake => 
        intake.userSupplementId === supp._id && intake.wasTaken
      ).length;
      
      return {
        supplement: supp.supplement?.name || 'Unknown',
        adherence: Math.round((actualIntakes / expectedIntakes) * 100),
        expected: expectedIntakes,
        actual: actualIntakes
      };
    });
    return adherenceData;
  };

  const calculateCostAnalysis = () => {
    return userSupplements.map(supp => {
      const cost = supp.cost || {};
      const dailyDoses = supp.frequency === 'Once Daily' ? 1 : supp.frequency === 'Twice Daily' ? 2 : 3;
      const dailyCost = cost.price && cost.quantity ? (cost.price / cost.quantity) * dailyDoses : 0;
      
      return {
        name: supp.supplement?.name || 'Unknown',
        dailyCost: dailyCost,
        monthlyCost: dailyCost * 30,
        yearlyCost: dailyCost * 365
      };
    });
  };

  const getHealthCorrelationData = () => {
    const vitaminDStart = userSupplements.find(s => s.supplement?.name === 'Vitamin D3')?.startDate;
    const b12Start = userSupplements.find(s => s.supplement?.name === 'Vitamin B12')?.startDate;
    
    return healthMetrics
      .filter(metric => metric.type === 'Energy')
      .sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt))
      .map(metric => ({
        date: metric.date,
        energy: metric.value,
        vitaminDActive: vitaminDStart ? new Date(metric.recordedAt) >= new Date(vitaminDStart) : false,
        b12Active: b12Start ? new Date(metric.recordedAt) >= new Date(b12Start) : false
      }));
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    const today = now.toDateString();
    const reminders = [];

    userSupplements.forEach(supp => {
      supp.specificTimes?.forEach(time => {
        const [hours, minutes] = time.split(':');
        const reminderTime = new Date();
        reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        if (reminderTime.toDateString() === today && reminderTime > now) {
          reminders.push({
            supplement: supp.supplement?.name || 'Unknown',
            time: time,
            withFood: supp.withFood,
            dosage: supp.dosage,
            unit: supp.supplement?.dosageUnit || 'units',
            id: supp._id
          });
        }
      });
    });

    return reminders.sort((a, b) => a.time.localeCompare(b.time));
  };

  // Modal components
  const AddSupplementModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      brand: '',
      type: 'Vitamin',
      dosage: '',
      unit: 'mg',
      frequency: 'Once Daily',
      times: ['08:00'],
      withFood: false,
      reason: '',
      cost: ''
    });

    const handleTimeChange = (index, value) => {
      const newTimes = [...formData.times];
      newTimes[index] = value;
      setFormData({ ...formData, times: newTimes });
    };

    const addTime = () => {
      setFormData({ ...formData, times: [...formData.times, '08:00'] });
    };

    const removeTime = (index) => {
      if (formData.times.length > 1) {
        const newTimes = [...formData.times];
        newTimes.splice(index, 1);
        setFormData({ ...formData, times: newTimes });
      }
    };

    const handleSubmit = () => {
      // Create a new supplement object
      const newSupplement = {
        _id: `supp_${Date.now()}`,
        name: formData.name,
        brand: formData.brand,
        type: formData.type,
        dosageUnit: formData.unit,
        servingSize: parseInt(formData.dosage),
        description: 'User-added supplement'
      };

      // Create a new user supplement entry
      const newUserSupplement = {
        _id: `us_${Date.now()}`,
        supplementId: newSupplement._id,
        supplement: newSupplement,
        dosage: parseInt(formData.dosage),
        frequency: formData.frequency,
        specificTimes: formData.times,
        withFood: formData.withFood,
        startDate: new Date(),
        reason: formData.reason,
        status: 'Active',
        cost: { 
          price: parseFloat(formData.cost), 
          quantity: 30, 
          currency: 'USD' 
        }
      };

      // Update state
      setSupplements(prev => [...prev, newSupplement]);
      setUserSupplements(prev => [...prev, newUserSupplement]);
      setShowAddModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl text-black font-bold mb-4 dark:text-white">Add New Supplement</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-2 dark:text-gray-300">Supplement Name</label>
              <input 
                type="text" 
                className="w-full p-3 border text-black border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                placeholder="e.g., Vitamin D3" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm  text-gray-700 font-medium mb-2 dark:text-gray-300">Brand</label>
              <input 
                type="text" 
                className="w-full p-3  text-black border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                placeholder="e.g., Nature Made" 
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-2 dark:text-gray-300">Type</label>
              <select 
                className="w-full p-3 text-black  border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option>Vitamin</option>
                <option>Mineral</option>
                <option>Herbal</option>
                <option>Amino Acid</option>
                <option>Probiotic</option>
                <option>Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm  text-gray-700 font-medium mb-2 dark:text-gray-300">Dosage</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  className="flex-1 p-3 text-black border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  placeholder="2000" 
                  value={formData.dosage}
                  onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                />
                <select 
                  className="w-24 p-3 border text-gray-700 border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                >
                  <option>mg</option>
                  <option>mcg</option>
                  <option>IU</option>
                  <option>g</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-2 dark:text-gray-300">Frequency</label>
              <select 
                className="w-full  text-black p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.frequency}
                onChange={(e) => setFormData({...formData, frequency: e.target.value})}
              >
                <option>Once Daily</option>
                <option>Twice Daily</option>
                <option>Three Times Daily</option>
                <option>As Needed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-2 dark:text-gray-300">Cost ($)</label>
              <input 
                type="number" 
                step="0.01" 
                className="w-full p-3 text-black  border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                placeholder="15.99" 
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm text-gray-700 font-medium mb-2 dark:text-gray-300">Intake Times</label>
            <div className="space-y-2">
              {formData.times.map((time, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input 
                    type="time" 
                    className="p-2  text-black border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                  />
                  {formData.times.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeTime(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={addTime}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Plus className="w-4 h-4" />
                Add another time
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex items-center">
            <input 
              type="checkbox" 
              id="withFood" 
              className="w-4 h-4 mr-2" 
              checked={formData.withFood}
              onChange={(e) => setFormData({...formData, withFood: e.target.checked})}
            />
            <label htmlFor="withFood" className="text-sm text-gray-700 font-medium dark:text-gray-300">Take with food</label>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm text-gray-700 font-medium mb-2 dark:text-gray-300">Reason for Taking</label>
            <textarea 
              className="w-full p-3 text-black border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              rows="3" 
              placeholder="e.g., Doctor recommended for vitamin D deficiency"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
            ></textarea>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button 
              onClick={() => setShowAddModal(false)}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Add Supplement
            </button>
          </div>
        </div>
      </div>
    );
  };

  const IntakeModal = () => {
    const [selectedSupplementId, setSelectedSupplementId] = useState(userSupplements[0]?._id || '');
    const [takenTime, setTakenTime] = useState(new Date().toISOString().slice(0, 16));
    const [takenAsPrescribed, setTakenAsPrescribed] = useState(true);
    const [notes, setNotes] = useState('');

    const handleSubmit = () => {
      handleIntakeRecord(selectedSupplementId, takenAsPrescribed, notes);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
          <h3 className="text-xl text-black font-bold mb-4 dark:text-white">Record Intake</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2 dark:text-gray-300">Supplement</label>
              <select 
                className="w-full text-black p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={selectedSupplementId}
                onChange={(e) => setSelectedSupplementId(e.target.value)}
              >
                {userSupplements.map(supp => (
                  <option key={supp._id} value={supp._id}>
                    {supp.supplement?.name} - {supp.dosage}{supp.supplement?.dosageUnit}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2 dark:text-gray-300">Time Taken</label>
              <input 
                type="datetime-local" 
                className="w-full p-3  text-black border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={takenTime}
                onChange={(e) => setTakenTime(e.target.value)}
              />
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                className="w-4 h-4 mr-2 text-black " 
                checked={takenAsPrescribed}
                onChange={(e) => setTakenAsPrescribed(e.target.checked)}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">Taken as prescribed</span>
            </div>
            
            <div>
              <label className="block  text-gray-600 text-sm font-medium mb-2 dark:text-gray-300">Notes (optional)</label>
              <textarea 
                className="w-full text-black p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                rows="3" 
                placeholder="Any side effects or observations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button 
              onClick={() => setShowIntakeModal(false)}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
            >
              Record Intake
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SupplementDetailModal = () => {
    if (!selectedSupplement) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-xl text-black font-bold dark:text-white">{selectedSupplement.supplement?.name}</h3>
            <button 
              onClick={() => setShowDetailModal(false)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-black dark:text-gray-300">Supplement Details</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Brand:</span>
                  <span className="font-medium text-black dark:text-gray-300">{selectedSupplement.supplement?.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="font-medium text-black dark:text-gray-300">{selectedSupplement.supplement?.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Dosage:</span>
                  <span className="font-medium text-black dark:text-gray-300">
                    {selectedSupplement.dosage} {selectedSupplement.supplement?.dosageUnit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Frequency:</span>
                  <span className="font-medium text-black dark:text-gray-300">{selectedSupplement.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Times:</span>
                  <span className="font-medium text-black dark:text-gray-300">{selectedSupplement.specificTimes?.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">With Food:</span>
                  <span className="font-medium text-black dark:text-gray-300">{selectedSupplement.withFood ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between mt-7">
                  <span className="text-gray-600 dark:text-gray-400 ">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium -mt-2 ${
                    selectedSupplement.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    selectedSupplement.status === 'Paused' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {selectedSupplement.status}
                  </span>
                </div>
              </div>
              
              {selectedSupplement.reason && (
                <div className="mt-4">
                  <h4 className="font-medium text-black mb-4 dark:text-gray-300">Reason for Taking</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-400">{selectedSupplement.reason}</p>
                </div>
              )}
              
              {selectedSupplement.cost && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-600 mb-2 dark:text-gray-300">Cost Information</h4>
                  <div className="text-sm text-gray-700 dark:text-gray-400">
                    <p>Price: ${selectedSupplement.cost.price} for {selectedSupplement.cost.quantity} servings</p>
                    <p>Daily cost: ${((selectedSupplement.cost.price / selectedSupplement.cost.quantity) * (selectedSupplement.frequency === 'Once Daily' ? 1 : 2)).toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="font-medium text-black mb-3 dark:text-gray-300">Supplement Information</h4>
              <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">{selectedSupplement.supplement?.description}</p>
              
              {selectedSupplement.supplement?.potentialBenefits && (
                <div className="mb-4">
                  <h5 className="font-medium text-black text-sm mb-2 dark:text-gray-300">Potential Benefits</h5>
                  <ul className="text-sm text-gray-700 dark:text-gray-400">
                    {selectedSupplement.supplement.potentialBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start mb-1">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedSupplement.supplement?.potentialSideEffects && (
                <div>
                  <h5 className="font-medium text-sm text-black mb-2 dark:text-gray-300">Potential Side Effects</h5>
                  <ul className="text-sm text-gray-700 dark:text-gray-400">
                    {selectedSupplement.supplement.potentialSideEffects.map((effect, index) => (
                      <li key={index} className="flex items-start mb-1">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{effect}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button 
              onClick={() => {
                setShowDetailModal(false);
                setShowIntakeModal(true);
              }}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
            >
              Record Intake
            </button>
            <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Edit Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Tab components
  const DashboardTab = () => {
    const adherenceData = calculateAdherence();
    const costData = calculateCostAnalysis();
    const reminders = getUpcomingReminders();
    const totalMonthlyCost = costData.reduce((sum, item) => sum + item.monthlyCost, 0);

    return (
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Active Supplements</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{userSupplements.length}</p>
              </div>
              <Pill className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Avg. Adherence</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-300">
                  {Math.round(adherenceData.reduce((sum, item) => sum + item.adherence, 0) / adherenceData.length) || 0}%
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Monthly Cost</p>
                <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">${totalMonthlyCost.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">Interactions</p>
                <p className="text-2xl font-bold text-red-800 dark:text-red-300">{interactions.filter(i => !i.acknowledged).length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg text-black font-semibold dark:text-white">Today's Reminders</h3>
            </div>
            <button 
              onClick={() => toggleSection('reminders')}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {expandedSections.reminders ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
          
          {expandedSections.reminders ? (
            reminders.length > 0 ? (
              <div className="space-y-3">
                {reminders.map((reminder, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-600 dark:text-white">{reminder.supplement}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {reminder.dosage} {reminder.unit} {reminder.withFood ? '(with food)' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600 dark:text-blue-400">{reminder.time}</p>
                      <button 
                        onClick={() => handleIntakeRecord(reminder.id)}
                        className="text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 mt-1"
                      >
                        Mark as taken
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No reminders for today</p>
            )
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Click to expand reminders</p>
          )}
        </div>

        {/* Interaction Warnings */}
        {interactions.filter(i => !i.acknowledged).length > 0 && (
          <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">Interaction Warnings</h3>
              </div>
              <button 
                onClick={() => toggleSection('interactions')}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {expandedSections.interactions ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            
            {expandedSections.interactions ? (
              <div className="space-y-4">
                {interactions.filter(i => !i.acknowledged).map(interaction => (
                  <div key={interaction._id} className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        interaction.severity === 'Severe' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        interaction.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {interaction.severity}
                      </span>
                      <button 
                        onClick={() => handleAcknowledgeInteraction(interaction._id)}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Acknowledge
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 dark:text-gray-300">{interaction.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{interaction.recommendation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Click to expand interaction warnings</p>
            )}
          </div>
        )}

        {/* Quick Charts */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg text-black font-semibold dark:text-white">Quick Overview</h3>
            <button 
              onClick={() => toggleSection('charts')}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {expandedSections.charts ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
          
          {expandedSections.charts ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-600 mb-4 dark:text-gray-300">Adherence Overview</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={adherenceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={theme === 'dark' ? 0.3 : 1} />
                    <XAxis dataKey="supplement" angle={-20} textAnchor="end" height={80} tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#374151',dy: 14,dx:15 }} />
                    <YAxis tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#374151' }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1F2937' : '#FFF',
                        borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                        color: theme === 'dark' ? '#F9FAFB' : '#1F2937'
                      }}
                    />
                    <Bar dataKey="adherence" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="font-medium text-gray-600 mb-4 dark:text-white">Cost Breakdown</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={costData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="monthlyCost"
                      nameKey="name"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {costData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip
  formatter={(value) => [`$${value.toFixed(2)}`, 'Monthly Cost']}
  contentStyle={{
    backgroundColor: theme === 'dark' ? '#141b25ff' : '#FFF',
    borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
  }}
  labelStyle={{
    color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
  }}
  itemStyle={{
    color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
  }}
/>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Click to expand charts</p>
          )}
        </div>
      </div>
    );
  };

  const SupplementsTab = () => {
     const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
    
  // Debounce the search to prevent excessive re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [localSearchQuery]);

     const filteredSupplements = useMemo(() => {
  return userSupplements.filter(supp => {
    const matchesSearch = supp.supplement?.name?.toLowerCase().includes(localSearchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || supp.status.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  });
}, [userSupplements, localSearchQuery, filterType]);

    return (
      <div className="space-y-6">
        {/* Header with search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
              type="text"
              placeholder="Search supplements..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-10 text-black pr-4 py-2 border border-gray-300 rounded-lg w-64 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              autoComplete="off"
            />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border text-black border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            <Plus className="w-4 h-4" />
            Add Supplement
          </button>
        </div>

        {/* Supplements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSupplements.map(supp => (
            <div key={supp._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-black text-lg dark:text-white mb-5">{supp.supplement?.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{supp.supplement?.brand}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Dosage:</span>
                  <span className="font-medium text-black dark:text-gray-300">{supp.dosage} {supp.supplement?.dosageUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Frequency:</span>
                  <span className="font-medium text-black dark:text-gray-300">{supp.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Times:</span>
                  <span className="font-medium text-black dark:text-gray-300">{supp.specificTimes?.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">With Food:</span>
                  <span className="font-medium text-black dark:text-gray-300 mb-3">{supp.withFood ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    supp.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    supp.status === 'Paused' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {supp.status}
                  </span>
                </div>
              </div>

              {supp.reason && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{supp.reason}</p>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => handleIntakeRecord(supp._id)}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm dark:bg-green-700 dark:hover:bg-green-800"
                >
                  Record Intake
                </button>
                <button 
                  onClick={() => {
                    setSelectedSupplement(supp);
                    setShowDetailModal(true);
                  }}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredSupplements.length === 0 && (
          <div className="text-center py-12">
            <Pill className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No supplements found matching your criteria.</p>
          </div>
        )}
      </div>
    );
  };

  const AnalyticsTab = () => {
    const adherenceData = calculateAdherence();
    const costData = calculateCostAnalysis();
    const healthCorrelationData = getHealthCorrelationData();
    
    // Prepare timeline data
    const timelineData = intakeHistory
      .reduce((acc, intake) => {
        const date = intake.takenAt.toISOString().split('T')[0];
        if (!acc[date]) acc[date] = { date, count: 0 };
        acc[date].count += 1;
        return acc;
      }, {});

    const sortedTimelineData = Object.values(timelineData)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-14); // Last 14 days

    return (
      <div className="space-y-8">
        {/* Adherence Analysis */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-xl text-gray-600 font-semibold mb-6 dark:text-white">Adherence Analysis</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-600 mb-4 dark:text-gray-300">Adherence Rates by Supplement</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={adherenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={theme === 'dark' ? 0.3 : 1} />
                  <XAxis dataKey="supplement" angle={-45} textAnchor="end" height={80} tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#374151' }} />
                  <YAxis tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#374151' }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1F2937' : '#FFF',
                      borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                      color: theme === 'dark' ? '#F9FAFB' : '#1F2937'
                    }}
                  />
                  <Bar dataKey="adherence" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="font-medium  text-gray-600 mb-4 dark:text-gray-300">Expected vs Actual Intakes</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={adherenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={theme === 'dark' ? 0.3 : 1} />
                  <XAxis dataKey="supplement" angle={-45} textAnchor="end" height={80} tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#374151' }} />
                  <YAxis tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#374151' }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1F2937' : '#FFF',
                      borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                      color: theme === 'dark' ? '#F9FAFB' : '#1F2937'
                    }}
                  />
                  <Bar dataKey="expected" fill="#21706dff" name="Expected" />
                  <Bar dataKey="actual" fill="#10B981" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Intake Timeline */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-xl text-gray-600  font-semibold mb-6 dark:text-white">Intake Timeline (Last 14 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={sortedTimelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={theme === 'dark' ? 0.3 : 1} />
              <XAxis dataKey="date" tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#374151' }} />
              <YAxis tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#374151' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1F2937' : '#FFF',
                  borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                  color: theme === 'dark' ? '#F9FAFB' : '#1F2937'
                }}
              />
              <Area type="monotone" dataKey="count" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Analysis */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-xl  text-gray-600 font-semibold mb-6 dark:text-white">Cost Analysis</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium  text-gray-600 mb-4 dark:text-gray-300">Monthly Cost Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={costData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="monthlyCost"
                    nameKey="name"
                    label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                  >
                    {costData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Monthly Cost']}
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1F2937' : '#FFF',
                      borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                      color: theme === 'dark' ? '#F9FAFB' : '#1F2937'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="lg:col-span-2">
              <h4 className="font-medium  text-gray-600 mb-4 dark:text-gray-300">Cost Breakdown by Time Period</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={costData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={theme === 'dark' ? 0.3 : 1} />
                  <XAxis type="number" tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#374151' }} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#374151' }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1F2937' : '#FFF',
                      borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                      color: theme === 'dark' ? '#F9FAFB' : '#1F2937'
                    }}
                  />
                  <Bar dataKey="dailyCost" fill="#3B82F6" name="Daily" />
                  <Bar dataKey="monthlyCost" fill="#10B981" name="Monthly" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Cost Summary Table */}
          <div className="mt-6">
            <h4 className="font-medium  text-gray-600 mb-4 dark:text-gray-300">Detailed Cost Breakdown</h4>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3  text-gray-600 text-left font-medium dark:text-gray-300">Supplement</th>
                    <th className="px-4 py-3  text-gray-600 text-right font-medium dark:text-gray-300">Daily Cost</th>
                    <th className="px-4 py-3  text-gray-600 text-right font-medium dark:text-gray-300">Monthly Cost</th>
                    <th className="px-4 py-3  text-gray-600 text-right font-medium dark:text-gray-300">Yearly Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {costData.map((item, index) => (
                    <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3  text-gray-600 dark:text-gray-300">{item.name}</td>
                      <td className="px-4 py-3  text-gray-600 text-right dark:text-gray-300">${item.dailyCost.toFixed(2)}</td>
                      <td className="px-4 py-3  text-gray-600 text-right dark:text-gray-300">${item.monthlyCost.toFixed(2)}</td>
                      <td className="px-4 py-3  text-gray-600 text-right dark:text-gray-300">${item.yearlyCost.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-gray-300 dark:border-gray-600 font-semibold bg-gray-50 dark:bg-gray-700">
                    <td className="px-4 py-3  text-gray-600 dark:text-gray-300">Total</td>
                    <td className="px-4 py-3  text-gray-600 text-right dark:text-gray-300">
                      ${costData.reduce((sum, item) => sum + item.dailyCost, 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3  text-gray-600 text-right dark:text-gray-300">
                      ${costData.reduce((sum, item) => sum + item.monthlyCost, 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3  text-gray-600 text-right dark:text-gray-300">
                      ${costData.reduce((sum, item) => sum + item.yearlyCost, 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Health Correlation */}
        <div className="bg-white  text-gray-600 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-6 dark:text-white">Health Metrics Correlation</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4 dark:text-gray-300">Energy Levels Over Time</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={healthCorrelationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={theme === 'dark' ? 0.3 : 1} />
                  <XAxis dataKey="date" tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#374151' }} />
                  <YAxis domain={[0, 10]} tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#374151' }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1F2937' : '#FFF',
                      borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                      color: theme === 'dark' ? '#F9FAFB' : '#1F2937'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="energy" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 dark:text-gray-300">Health Metrics Summary</h4>
              <div className="space-y-4">
                {['Energy', 'Mood', 'Sleep'].map(metric => {
                  const metricData = healthMetrics.filter(hm => hm.type === metric);
                  const average = metricData.reduce((sum, hm) => sum + hm.value, 0) / metricData.length;
                  
                  return (
                    <div key={metric} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium dark:text-gray-300">{metric}</span>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {average ? average.toFixed(1) : 'N/A'}/10
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(average || 0) * 10}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly and Monthly Patterns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white  text-gray-600 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Weekly Adherence Pattern</h3>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
                // Calculate adherence for each day of week
                const dayIntakes = intakeHistory.filter(intake => 
                  intake.takenAt.getDay() === index && intake.wasTaken
                );
                const adherenceRate = Math.min((dayIntakes.length / 4) * 100, 100); // Assume max 4 intakes per day
                
                return (
                  <div key={day} className="text-center">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">{day}</div>
                    <div 
                      className="w-full h-16 rounded-lg flex items-end justify-center text-xs text-white font-medium"
                      style={{ 
                        backgroundColor: `hsl(${adherenceRate * 1.2}, 70%, 50%)`,
                        opacity: adherenceRate / 100 
                      }}
                    >
                      {adherenceRate.toFixed(0)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white  text-gray-600 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Intake Consistency Score</h3>
            <div className="text-center">
              <div className="inline-block">
                <div className="relative w-32 h-32">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#3B82F6"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.87)}`}
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">87%</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                Your consistency score is based on regular intake patterns and adherence rates.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const HistoryTab = () => {
    const filteredHistory = intakeHistory
      .filter(intake => {
        const intakeDate = intake.takenAt.toISOString().split('T')[0];
        return intakeDate >= dateRange.start && intakeDate <= dateRange.end;
      })
      .sort((a, b) => new Date(b.takenAt) - new Date(a.takenAt));

    return (
      <div className="space-y-6">
        {/* Date Range Filter */}
        <div className="bg-white text-gray-600 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <h3 className="text-lg text-gray-600 font-semibold dark:text-white mr-6">Intake History</h3>
            <div className="flex gap-4 items-center">
              <div className =" text-grey-600 ">
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">From</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="px-3 py-2  text-black border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">To</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="px-3 py-2  text-black border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* History Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total Intakes</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-300">{filteredHistory.filter(h => h.wasTaken).length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">Missed Doses</p>
                <p className="text-2xl font-bold text-red-800 dark:text-red-300">{filteredHistory.filter(h => !h.wasTaken).length}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Adherence Rate</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                  {filteredHistory.length > 0 
                    ? Math.round((filteredHistory.filter(h => h.wasTaken).length / filteredHistory.length) * 100)
                    : 0
                  }%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* History Timeline */}
        <div className="bg-white text-gray-600 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6 dark:text-white">Intake Timeline</h3>
          
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No intake records found for the selected date range.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.slice(0, 50).map(intake => (
                <div key={intake._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${intake.wasTaken ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="font-medium dark:text-white">{intake.supplement}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {intake.dosageTaken} units
                        {intake.notes && ` • ${intake.notes}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium dark:text-gray-300">
                      {intake.takenAt.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {intake.takenAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {filteredHistory.length > 50 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing latest 50 entries. {filteredHistory.length - 50} more entries available.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const InteractionsTab = () => {
    return (
      <div className="space-y-6">
        {/* Interaction Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Severe', 'Moderate', 'Mild'].map(severity => {
            const count = interactions.filter(i => i.severity === severity).length;
            const colors = {
              Severe: 'red',
              Moderate: 'yellow', 
              Mild: 'blue'
            };
            const color = colors[severity];
            
            return (
              <div key={severity} className={`bg-${color}-50 dark:bg-${color}-900/20 border border-${color}-200 dark:border-${color}-800 rounded-xl p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm text-${color}-600 dark:text-${color}-400 font-medium`}>{severity} Interactions</p>
                    <p className={`text-2xl font-bold text-${color}-800 dark:text-${color}-300`}>{count}</p>
                  </div>
                  <AlertTriangle className={`w-8 h-8 text-${color}-600 dark:text-${color}-400`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Interactions */}
        <div className="bg-white text-gray-600 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6 dark:text-white">Current Interaction Warnings</h3>
          
          {interactions.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-300 dark:text-green-600 mx-auto mb-4" />
              <p className="text-green-600 dark:text-green-400 font-medium">No interactions detected</p>
              <p className="text-gray-500 dark:text-gray-400">Your current supplement regimen appears safe.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {interactions.map(interaction => (
                <div key={interaction._id} className={`p-6 border-2 rounded-xl ${
                  interaction.severity === 'Severe' ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' :
                  interaction.severity === 'Moderate' ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20' :
                  'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`w-6 h-6 ${
                        interaction.severity === 'Severe' ? 'text-red-600 dark:text-red-400' :
                        interaction.severity === 'Moderate' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-blue-600 dark:text-blue-400'
                      }`} />
                      <div>
                        <h4 className="font-semibold dark:text-white">{interaction.severity} Interaction</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Between {interaction.supplementsInvolved.join(' and ')}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      interaction.severity === 'Severe' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      interaction.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {interaction.severity}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-sm mb-1 dark:text-gray-300">Description:</h5>
                      <p className="text-sm text-gray-700 dark:text-gray-400">{interaction.description}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-1 dark:text-gray-300">Recommendation:</h5>
                      <p className="text-sm text-gray-700 dark:text-gray-400">{interaction.recommendation}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-4">
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
                      Consult Healthcare Provider
                    </button>
                    {!interaction.acknowledged && (
                      <button 
                        onClick={() => handleAcknowledgeInteraction(interaction._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm dark:bg-blue-700 dark:hover:bg-blue-800"
                      >
                        Acknowledge Warning
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Educational Section */}
        <div className="bg-white  text-gray-600 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Understanding Supplement Interactions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 dark:text-gray-300">Common Interaction Types</h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Absorption:</strong> One supplement may interfere with the absorption of another</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Metabolism:</strong> Changes in how supplements are processed by the body</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Synergistic:</strong> Supplements that work better together</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3 dark:text-gray-300">Safety Tips</h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Always consult healthcare providers before starting new supplements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Space out supplements that may interact by 2+ hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Keep detailed records of all supplements and medications</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
    onClick={() => window.history.back()}
    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    aria-label="Go Back"
  >
    <ArrowLeft className="w-5 h-5" />
  </button>

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Supplement Manager</h1>
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowIntakeModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
              >
                <Plus className="w-4 h-4" />
                Quick Log
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>Welcome back!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'supplements', label: 'My Supplements', icon: Pill },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'history', label: 'History', icon: Calendar },
              { id: 'interactions', label: 'Interactions', icon: AlertTriangle }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'supplements' && <SupplementsTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'interactions' && <InteractionsTab />}
      </div>

      {/* Modals */}
      {showAddModal && <AddSupplementModal />}
      {showIntakeModal && <IntakeModal />}
      {showDetailModal && <SupplementDetailModal />}
    </div>
  );
};

// Wrap the app with ThemeProvider
const AppWithTheme = () => (
  <ThemeProvider>
    <SupplementManagementSystem />
  </ThemeProvider>
);

export default AppWithTheme;
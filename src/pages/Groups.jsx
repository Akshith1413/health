import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Groups = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('discover');
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [suggestedGroups, setSuggestedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');

  // Form state for creating group
  const [formData, setFormData] = useState({
    groupName: '',
    description: '',
    category: '',
    targetConditions: [],
    severityLevel: 'medium',
    privacy: 'public',
    requireApproval: false,
    maxMembers: '',
    minAge: '',
    maxAge: '',
    allowedGenders: []
  });
  const [newCondition, setNewCondition] = useState('');

  const categories = [
    { value: 'chronic_diseases', label: 'Chronic Diseases', icon: '🏥' },
    { value: 'mental_health', label: 'Mental Health', icon: '🧠' },
    { value: 'fitness_goals', label: 'Fitness Goals', icon: '💪' },
    { value: 'diet_nutrition', label: 'Diet & Nutrition', icon: '🥗' },
    { value: 'age_groups', label: 'Age Groups', icon: '👥' },
    { value: 'gender_specific', label: 'Gender Specific', icon: '⚧' },
    { value: 'recovery_support', label: 'Recovery Support', icon: '🌱' },
    { value: 'preventive_care', label: 'Preventive Care', icon: '🛡️' },
    { value: 'family_health', label: 'Family Health', icon: '👨‍👩‍👧‍👦' },
    { value: 'other', label: 'Other', icon: '🔗' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' }
  ];

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedCondition) params.append('condition', selectedCondition);

      const response = await axios.get(`/groups/discover?${params.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setGroups(response.data);
    } catch (err) {
      console.error('Failed to fetch groups:', err);
      setError('Failed to load groups');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedCondition]);

  const fetchMyGroups = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/groups/my', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMyGroups(response.data);
    } catch (err) {
      console.error('Failed to fetch my groups:', err);
      setError('Failed to load your groups');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSuggestedGroups = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/groups/suggested', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuggestedGroups(response.data);
    } catch (err) {
      console.error('Failed to fetch suggested groups:', err);
      setError('Failed to load suggested groups');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'discover') {
      fetchGroups();
    } else if (activeTab === 'my-groups') {
      fetchMyGroups();
    } else if (activeTab === 'suggested') {
      fetchSuggestedGroups();
    }
  }, [activeTab, fetchGroups, fetchMyGroups, fetchSuggestedGroups]);

  const handleSearch = useCallback(() => {
    if (activeTab === 'discover') {
      fetchGroups();
    }
  }, [searchQuery, selectedCategory, selectedCondition, activeTab, fetchGroups]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (activeTab === 'discover') {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategory, selectedCondition, activeTab, handleSearch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'allowedGenders') {
        setFormData(prev => ({
          ...prev,
          allowedGenders: checked
            ? [...prev.allowedGenders, value]
            : prev.allowedGenders.filter(g => g !== value)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        targetConditions: [...prev.targetConditions, newCondition.trim()]
      }));
      setNewCondition('');
    }
  };

  const removeCondition = (index) => {
    setFormData(prev => ({
      ...prev,
      targetConditions: prev.targetConditions.filter((_, i) => i !== index)
    }));
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        maxMembers: formData.maxMembers ? parseInt(formData.maxMembers) : null,
        minAge: formData.minAge ? parseInt(formData.minAge) : null,
        maxAge: formData.maxAge ? parseInt(formData.maxAge) : null,
      };

      const response = await axios.post('/groups', submitData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setSuccess('Group created successfully!');
      setError('');
      setCreating(false);
      setFormData({
        groupName: '',
        description: '',
        category: '',
        targetConditions: [],
        severityLevel: 'medium',
        privacy: 'public',
        requireApproval: false,
        maxMembers: '',
        minAge: '',
        maxAge: '',
        allowedGenders: []
      });
      
      // Refresh groups
      if (activeTab === 'discover') {
        fetchGroups();
      } else if (activeTab === 'my-groups') {
        fetchMyGroups();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
      setSuccess('');
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const response = await axios.post(`/groups/${groupId}/join`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setSuccess(response.data.message);
      setError('');
      
      // Refresh groups
      fetchGroups();
      if (activeTab === 'my-groups') {
        fetchMyGroups();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join group');
      setSuccess('');
    }
  };

  const handleLeaveGroup = async (groupId) => {
    if (window.confirm('Are you sure you want to leave this group?')) {
      try {
        await axios.post(`/groups/${groupId}/leave`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        setSuccess('Left group successfully');
        setError('');
        
        fetchMyGroups();
        if (activeTab === 'discover') {
          fetchGroups();
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to leave group');
        setSuccess('');
      }
    }
  };

  const GroupCard = ({ group, showJoinButton = true, showLeaveButton = false }) => {
    const getCategoryIcon = (category) => {
      return categories.find(cat => cat.value === category)?.icon || '🔗';
    };

    const getSeverityColor = (severity) => {
      return severityLevels.find(level => level.value === severity)?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    };

    const isCreator = group.creator._id === user._id;
    const isMember = group.members.some(m => m.user._id === user._id && m.role !== 'pending');
    const isPending = group.members.some(m => m.user._id === user._id && m.role === 'pending');

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getCategoryIcon(group.category)}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {group.groupName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {group.category.replace('_', ' ')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {group.privacy === 'private' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                Private
              </span>
            )}
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(group.severityLevel)}`}>
              {group.severityLevel}
            </span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-3">
          {group.description}
        </p>

        {group.targetConditions && group.targetConditions.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Target Conditions:</h4>
            <div className="flex flex-wrap gap-1">
              {group.targetConditions.slice(0, 3).map((condition, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                >
                  {condition}
                </span>
              ))}
              {group.targetConditions.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{group.targetConditions.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <span>{group.membersCount} members</span>
            {group.maxMembers && (
              <span>Max: {group.maxMembers}</span>
            )}
            {(group.minAge || group.maxAge) && (
              <span>
                Age: {group.minAge || 0}-{group.maxAge || '∞'}
              </span>
            )}
          </div>
          <span className="text-xs">
            By {group.creator.username}
          </span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/groups/${group._id}`)}
            className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
          >
            View Details
          </button>
          
          {showJoinButton && !isMember && !isPending && !isCreator && (
            <button
              onClick={() => handleJoinGroup(group._id)}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              {group.requireApproval ? 'Request to Join' : 'Join Group'}
            </button>
          )}
          
          {isPending && (
            <span className="px-3 py-2 text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 rounded-lg">
              Pending Approval
            </span>
          )}
          
          {showLeaveButton && (isMember || isCreator) && !isCreator && (
            <button
              onClick={() => handleLeaveGroup(group._id)}
              className="px-3 py-2 text-sm bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors duration-200"
            >
              Leave
            </button>
          )}
          
          {isCreator && (
            <span className="px-3 py-2 text-sm bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 rounded-lg">
              Owner
            </span>
          )}
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900"
    >
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Health Support Groups
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with others who share similar health conditions and goals
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-start"
          >
            <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 flex items-start"
          >
            <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{success}</span>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 mb-6">
          <div className="border-b border-gray-200 dark:border-slate-700">
            <nav className="flex -mb-px">
              {[
                { key: 'discover', label: 'Discover Groups', count: groups.length },
                { key: 'suggested', label: 'Suggested', count: suggestedGroups.length },
                { key: 'my-groups', label: 'My Groups', count: myGroups.length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === tab.key
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          {/* Search and Filters */}
          {activeTab === 'discover' && (
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Search groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Filter by condition..."
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Create Group Button */}
          <div className="p-4 bg-gray-50 dark:bg-slate-700/30">
            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Group
            </button>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'discover' && groups.map(group => (
            <GroupCard key={group._id} group={group} showJoinButton={true} />
          ))}
          
          {activeTab === 'suggested' && suggestedGroups.map(group => (
            <GroupCard key={group._id} group={group} showJoinButton={true} />
          ))}
          
          {activeTab === 'my-groups' && myGroups.map(group => (
            <GroupCard key={group._id} group={group} showJoinButton={false} showLeaveButton={true} />
          ))}
        </div>

        {/* Empty States */}
        {activeTab === 'discover' && groups.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No groups found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your search criteria or create a new group
            </p>
          </div>
        )}

        {activeTab === 'suggested' && suggestedGroups.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💡</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No suggested groups
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Complete your health profile to get personalized group suggestions
            </p>
            <button
              onClick={() => navigate('/healthprofile')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Complete Health Profile
            </button>
          </div>
        )}

        {activeTab === 'my-groups' && myGroups.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              You haven't joined any groups yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Discover groups that match your health interests
            </p>
            <button
              onClick={() => setActiveTab('discover')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Discover Groups
            </button>
          </div>
        )}

        {/* Create Group Modal */}
        <AnimatePresence>
          {creating && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Create New Support Group
                    </h2>
                    <button
                      onClick={() => setCreating(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleCreateGroup} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Group Name *
                        </label>
                        <input
                          type="text"
                          name="groupName"
                          value={formData.groupName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description *
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.icon} {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Severity Level
                        </label>
                        <select
                          name="severityLevel"
                          value={formData.severityLevel}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          {severityLevels.map((level) => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Target Conditions
                        </label>
                        <div className="flex mb-2">
                          <input
                            type="text"
                            value={newCondition}
                            onChange={(e) => setNewCondition(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                            className="flex-1 border border-gray-300 dark:border-slate-600 rounded-l-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Add a condition (e.g., Diabetes, Asthma)"
                          />
                          <button
                            type="button"
                            onClick={addCondition}
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-r-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.targetConditions.map((condition, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                            >
                              {condition}
                              <button
                                type="button"
                                onClick={() => removeCondition(index)}
                                className="ml-2 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Privacy
                        </label>
                        <select
                          name="privacy"
                          value={formData.privacy}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Max Members
                        </label>
                        <input
                          type="number"
                          name="maxMembers"
                          value={formData.maxMembers}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          min="1"
                          placeholder="No limit"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Min Age
                        </label>
                        <input
                          type="number"
                          name="minAge"
                          value={formData.minAge}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          min="0"
                          max="120"
                          placeholder="No minimum"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Max Age
                        </label>
                        <input
                          type="number"
                          name="maxAge"
                          value={formData.maxAge}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          min="0"
                          max="120"
                          placeholder="No maximum"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Allowed Genders
                        </label>
                        <div className="flex space-x-4">
                          {['Male', 'Female', 'Other'].map((gender) => (
                            <label key={gender} className="flex items-center">
                              <input
                                type="checkbox"
                                name="allowedGenders"
                                value={gender}
                                checked={formData.allowedGenders.includes(gender)}
                                onChange={handleInputChange}
                                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-slate-600 rounded"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{gender}</span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Leave unchecked to allow all genders
                        </p>
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="requireApproval"
                            checked={formData.requireApproval}
                            onChange={handleInputChange}
                            className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-slate-600 rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Require approval for new members
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => setCreating(false)}
                        className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      >
                        Create Group
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Groups;
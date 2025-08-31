import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AddFamily = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingFamily, setCreatingFamily] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [view, setView] = useState('my-families'); // my-families, create, requests, family-detail
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Form states
  const [familyName, setFamilyName] = useState('');
  const [familyType, setFamilyType] = useState('immediate');
  const [familyDescription, setFamilyDescription] = useState('');
  

  useEffect(() => {
    fetchFamilyData();
  }, []);

  const fetchFamilyData = async () => {
    try {
      setLoading(true);
      const [familiesResponse, requestsResponse] = await Promise.all([
        axios.get('/families', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/family/requests', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      setFamilies(familiesResponse.data);
      setRequests(requestsResponse.data);
    } catch (err) {
      console.error('Failed to fetch family data:', err);
      setError('Failed to load family data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFamily = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/family', { 
        familyName, 
        familyType, 
        description: familyDescription 
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setFamilies([...families, response.data.family]);
      setCreatingFamily(false);
      setFamilyName('');
      setFamilyType('immediate');
      setFamilyDescription('');
      setSuccess('Family created successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create family');
      setSuccess('');
    }
  };

  const handleSendInvite = async (e) => {
  e.preventDefault();
  setInviteLoading(true);
  try {
    const response = await axios.post(`/family/${selectedFamily._id}/invite`, {
      email: inviteEmail,
      message: inviteMessage,
      role: inviteRole
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    
    setInviting(false);
    setInviteEmail('');
    setInviteMessage('');
    setInviteRole('member');
    setSuccess('Invitation sent successfully');
    setError('');
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to send invitation');
    setSuccess('');
  } finally {
    setInviteLoading(false);
  }
};

  const handleRespondToRequest = async (requestId, response) => {
    try {
      await axios.post(`/family/requests/${requestId}/respond`, { response }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setSuccess(`Request ${response} successfully`);
      setError('');
      
      // Refresh data
      fetchFamilyData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request');
      setSuccess('');
    }
  };

  const handleLeaveFamily = async (familyId) => {
    if (window.confirm('Are you sure you want to leave this family?')) {
      try {
        await axios.post(`/family/${familyId}/leave`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        setSuccess('Left family successfully');
        setError('');
        
        // Refresh data
        fetchFamilyData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to leave family');
        setSuccess('');
      }
    }
  };

  const handleDeleteFamily = async (familyId) => {
    if (window.confirm('Are you sure you want to delete this family? This action cannot be undone.')) {
      try {
        await axios.delete(`/family/${familyId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        setSuccess('Family deleted successfully');
        setError('');
        
        // Refresh data
        fetchFamilyData();
        setView('my-families');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete family');
        setSuccess('');
      }
    }
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
      <main className="flex-1 max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-slate-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Family Management</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Manage your families and connect with loved ones
            </p>
          </div>

          {error && (
            <div className="m-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="m-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
              {success}
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 dark:border-slate-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setView('my-families')}
                className={`py-4 px-6 text-sm font-medium ${view === 'my-families' ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                My Families
              </button>
              <button
                onClick={() => setView('requests')}
                className={`py-4 px-6 text-sm font-medium ${view === 'requests' ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Requests ({requests.length})
              </button>
              <button
                onClick={() => {
                  setCreatingFamily(true);
                  setView('create');
                }}
                className={`py-4 px-6 text-sm font-medium ${view === 'create' ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Create Family
              </button>
            </nav>
          </div>

          <div className="p-6">
            {view === 'my-families' && (
              <div>
                {families.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">You don't have any families yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Create a family or accept an invitation to get started</p>
                    <button
                      onClick={() => {
                        setCreatingFamily(true);
                        setView('create');
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create Your First Family
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {families.map(family => (
                      <div key={family._id} className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">{family.familyName}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{family.familyType}</p>
                            {family.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{family.description}</p>
                            )}
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            family.owner._id === user._id 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {family.owner._id === user._id ? 'Owner' : 'Member'}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          <p>{family.members.filter(m => m.status === 'accepted').length} members</p>
                          <p>Created: {new Date(family.createdAt).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedFamily(family);
                              setView('family-detail');
                            }}
                            className="flex-1 text-center px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                          >
                            View
                          </button>
                          
                          {family.owner._id === user._id ? (
                            <button
                              onClick={() => handleDeleteFamily(family._id)}
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                              Delete
                            </button>
                          ) : (
                            <button
                              onClick={() => handleLeaveFamily(family._id)}
                              className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
                            >
                              Leave
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {view === 'create' && (
              <div className="max-w-md mx-auto">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Create New Family</h4>
                <form onSubmit={handleCreateFamily} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Family Name *
                    </label>
                    <input
                      type="text"
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                      className="block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white bg-white dark:bg-slate-700"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Family Type
                    </label>
                    <select
                      value={familyType}
                      onChange={(e) => setFamilyType(e.target.value)}
                      className="block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white bg-white dark:bg-slate-700"
                    >
                      <option value="immediate">Immediate Family</option>
                      <option value="extended">Extended Family</option>
                      <option value="friends">Friends</option>
                      <option value="health_group">Health Group</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description (optional)
                    </label>
                    <textarea
                      value={familyDescription}
                      onChange={(e) => setFamilyDescription(e.target.value)}
                      className="block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white bg-white dark:bg-slate-700"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create Family
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCreatingFamily(false);
                        setView('my-families');
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {view === 'requests' && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Pending Family Requests</h4>
                {requests.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No pending requests</p>
                ) : (
                  <div className="space-y-4">
                    {requests.map(request => (
                      <div key={request._id} className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="text-md font-medium text-gray-900 dark:text-white">
                              {request.fromUser.username} invited you to join {request.family.familyName}
                            </h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {request.fromUser.email} • {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                              Role: <span className="capitalize">{request.role}</span>
                            </p>
                            {request.message && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{request.message}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleRespondToRequest(request._id, 'accepted')}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRespondToRequest(request._id, 'rejected')}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {view === 'family-detail' && selectedFamily && (
              <FamilyDetailView 
                family={selectedFamily} 
                onBack={() => setView('my-families')}
                onInvite={() => setInviting(true)}
                onLeave={handleLeaveFamily}
                user={user}
              />
            )}

            {inviting && selectedFamily && (
  <InviteModal 
    family={selectedFamily} 
    onClose={() => setInviting(false)}
    onInviteSent={(message) => {
      setSuccess(message);
      setError('');
    }}
  />
)}
          </div>
        </div>
      </main>
       {/* Footer stays at bottom with a tiny gap */}
  <div className="mt-4">
    <Footer />
  </div>
    </motion.div>
  );
};

// Family Detail View Component
const FamilyDetailView = ({ family, onBack, onInvite, onLeave, user }) => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await axios.get(`/family/${family._id}/health-dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setHealthData(response.data);
      } catch (err) {
        console.error('Failed to fetch health dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, [family._id]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={onBack}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 mb-2 flex items-center"
          >
            ← Back to Families
          </button>
          <h4 className="text-xl font-medium text-gray-900 dark:text-white">{family.familyName}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{family.familyType}</p>
        </div>
        
        <div className="flex space-x-3">
          {family.owner._id === user._id && (
            <button
              onClick={onInvite}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Invite Member
            </button>
          )}
          {family.owner._id !== user._id && (
            <button
              onClick={() => onLeave(family._id)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600"
            >
              Leave Family
            </button>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h5 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Family Members</h5>
        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {family.members.filter(m => m.status === 'accepted').map(member => (
              <div key={member.user._id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-600 rounded-md">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{member.user.username}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{member.user.email}</p>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                    member.role === 'owner' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                      : member.role === 'admin'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {member.role}
                  </span>
                </div>
                {family.owner._id === user._id && member.user._id !== user._id && (
                  <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm">
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h5 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Family Health Overview</h5>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : healthData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthData.members.map(member => (
              <div key={member._id} className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{member.username}</h6>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{member.email}</p>
                
                {member.healthProfile ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-300">Age:</span>
                      <span className="text-gray-900 dark:text-white">{member.healthProfile.age || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-300">Gender:</span>
                      <span className="text-gray-900 dark:text-white">{member.healthProfile.gender || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-300">Height:</span>
                      <span className="text-gray-900 dark:text-white">{member.healthProfile.height ? `${member.healthProfile.height} cm` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-300">Weight:</span>
                      <span className="text-gray-900 dark:text-white">{member.healthProfile.weight ? `${member.healthProfile.weight} kg` : 'N/A'}</span>
                    </div>
                    {member.healthProfile.conditions && member.healthProfile.conditions.length > 0 && (
                      <div className="text-xs">
                        <span className="text-gray-600 dark:text-gray-300">Conditions: </span>
                        <span className="text-gray-900 dark:text-white">
                          {member.healthProfile.conditions.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">No health profile available</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Unable to load health data</p>
        )}
      </div>
    </div>
  );
};
// Add this component inside your AddFamily component
const InviteModal = ({ family, onClose, onInviteSent }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`/family/${family._id}/invite`, {
        email: inviteEmail,
        message: inviteMessage,
        role: inviteRole
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      onInviteSent('Invitation sent successfully');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg max-w-md w-full">
        <h5 className="text-md font-medium text-gray-900 dark:text-white mb-3">Invite to {family.familyName}</h5>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSendInvite} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white bg-white dark:bg-slate-700"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white bg-white dark:bg-slate-700"
              disabled={loading}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="child">Child</option>
              <option value="elder">Elder</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message (optional)
            </label>
            <textarea
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              className="block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white bg-white dark:bg-slate-700"
              rows={3}
              disabled={loading}
            />
          </div>
          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending...
                </>
              ) : (
                'Send Invitation'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddFamily;
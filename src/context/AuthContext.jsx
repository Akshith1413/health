import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'https://healthback-1wfl.onrender.com';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('/profile');
          setUser(response.data);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await axios.post('/signin', { email, password });
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser({ _id: response.data.userId, username: response.data.username });
      return { success: true };
    } catch (err) {
      console.error('Sign in error:', err.response?.data?.message || err.message);
      return { success: false, message: err.response?.data?.message || 'Sign in failed' };
    }
  };

  const signUp = async (username, email, password) => {
    try {
      const response = await axios.post('/signup', { username, email, password });
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser({ _id: response.data.userId, username: response.data.username });
      return { success: true };
    } catch (err) {
      console.error('Sign up error:', err.response?.data?.message || err.message);
      return { success: false, message: err.response?.data?.message || 'Sign up failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
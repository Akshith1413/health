import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext'; 
import Landing from './Landing';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  // Floating orb colors
  const colors = theme === 'light' 
    ? ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'] 
    : ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  // Handle mouse move for gradient effect
  const handleMouseMove = (e) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Optional: animate background transition
    animate('html', {
      backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc'
    }, { duration: 0.5 });
  }, [theme]);

  // Floating orbs animation
  const FloatingOrbs = () => {
    return (
      <>
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
              opacity: 0
            }}
            animate={{
              x: [null, Math.random() * 200 - 100],
              y: [null, Math.random() * 200 - 100],
              opacity: [0, 0.6, 0],
              transition: {
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: Math.random() * 5
              }
            }}
            style={{
              background: `radial-gradient(circle, ${colors[i % colors.length]}, transparent 70%)`,
              width: `${100 + Math.random() * 200}px`,
              height: `${100 + Math.random() * 200}px`,
              position: 'absolute',
              borderRadius: '50%',
              filter: 'blur(40px)',
              zIndex: 0
            }}
          />
        ))}
      </>
    );
  };

  return (
    <div>
      {/* First Section - Centered Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-gray-900 flex flex-col overflow-hidden relative"
        onMouseMove={handleMouseMove}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none"
          style={{
            background: useMotionTemplate`radial-gradient(600px at ${mouseX}px ${mouseY}px, rgba(99, 102, 241, 0.15), transparent 80%)`
          }}
        />

        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <FloatingOrbs />
        </div>

        {/* Navbar */}
        <Navbar />

        {/* Centered Hero Content */}
        <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl w-full">
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
              className="mb-12"
            >
              <motion.h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 leading-tight"
                whileHover={{ scale: 1.02 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
                  {user ? `Welcome back, ${user.username}!` : 'HealthApp'}
                </span>
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                {user
                  ? 'Your personalized health dashboard awaits. Track, analyze, and optimize your wellbeing.'
                  : 'Revolutionary health tracking powered by AI. Sign up now to begin your wellness journey.'}
              </motion.p>
            </motion.div>

            {!user && (
  <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.4, duration: 0.8 }}
  className="flex flex-col sm:flex-row justify-center gap-6"
>
  <motion.button
    onClick={() => navigate('/signin')}
    className="relative px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-base rounded-xl hover:shadow-xl transition-all group overflow-hidden"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onHoverStart={() => setIsHovered(true)}
    onHoverEnd={() => setIsHovered(false)}
  >
    <span className="relative z-10 flex items-center justify-center gap-2">
      Sign In <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
    </span>
    <motion.span
      className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"
      initial={{ opacity: 0 }}
      animate={{ opacity: isHovered ? 1 : 0 }}
    />
  </motion.button>

  <motion.button
    onClick={() => navigate('/signup')}
    className="relative px-10 py-5 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold text-base rounded-xl border-2 border-indigo-500/20 hover:border-indigo-500/40 hover:shadow-xl transition-all group overflow-hidden"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <span className="relative z-10">Sign Up</span>
    <motion.span
      className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    />
  </motion.button>
</motion.div>

)}

{!user && (
   <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.8, duration: 0.8 }}
    className="mt-16 flex flex-col items-center justify-center"
  >
    <motion.p 
      className="text-gray-900 dark:text-gray-400 mb-5 text-sm font-medium"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      Scroll to explore
    </motion.p>
    <motion.div
      className="w-6 h-10 border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.5 }}
    >
      <motion.div
        className="w-1 h-3 bg-indigo-500 dark:bg-indigo-400 rounded-full mt-2"
        animate={{ 
          y: [0, 12, 0],
          opacity: [1, 0.5, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  </motion.div>
)}

            {user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
              >
                {['Dashboard', 'Analytics', 'Profile', 'Health Profile', 'Add Family'].map((item, i) => (
                  <motion.div
                    key={item}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 dark:border-slate-700"
                    onClick={() => navigate(`/${item.toLowerCase().replace(/\s+/g, '')}`)}
                  >
                    <div className="w-12 h-12 mb-4 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                      <FiArrowRight className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Access your {item.toLowerCase()} and manage your health data
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </main>

        
      </motion.div>

      {/* Landing Section - Appears after scrolling */}
      <Landing />
      {/* Footer positioned at bottom */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="relative z-10"
        >
          <Footer />
        </motion.div>
    </div>
  );
};

export default Home;
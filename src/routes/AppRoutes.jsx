import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';
import ProtectedRoute from '../components/ProtectedRoute';
import Landing from '../pages/Landing.jsx';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/land" element={<Landing />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
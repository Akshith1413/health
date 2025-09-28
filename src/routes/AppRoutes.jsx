import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';
import ProtectedRoute from '../components/ProtectedRoute';
import Landing from '../pages/Landing.jsx';
import HealthProfile from '../pages/healthprofile.jsx';
import AddFamily from '../pages/addfamily.jsx';
import Group from '../pages/Groups.jsx';
import Supplements from '../pages/Supplements.jsx';
import Nutrition from '../pages/Nutrition.jsx';
import Appointment from '../pages/Appointments.jsx';
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
      <Route path="/healthprofile" element={<ProtectedRoute><HealthProfile /></ProtectedRoute>} />
      
<Route path="/addfamily" element={<ProtectedRoute><AddFamily /></ProtectedRoute>} />
<Route path="/groups" element={<ProtectedRoute><Group /></ProtectedRoute>} />
<Route path="/supplements" element={<ProtectedRoute><Supplements /></ProtectedRoute>} />
<Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
<Route path="/appointments" element={<ProtectedRoute><Appointment /></ProtectedRoute>} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
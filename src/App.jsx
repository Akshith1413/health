import { HashRouter as Router } from 'react-router-dom';
import { AuthProvider } from '/src/context/AuthContext.jsx';
import AuthGate from './components/AuthGate';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <Router>
          <AppRoutes />
        </Router>
      </AuthGate>
    </AuthProvider>
  );
}

export default App;
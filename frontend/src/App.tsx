import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './pages/AdminDashboard';
import { CreateExam } from './pages/CreateExam';
import { StudentDashboard } from './pages/StudentDashboard';
import { ExamInterface } from './pages/ExamInterface';
import { ResultsScreen } from './pages/ResultsScreen';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'dummy-client-id';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/create" element={<CreateExam />} />
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/exam/:id" element={<ExamInterface />} />
              <Route path="/exam/:id/results" element={<ResultsScreen />} />
              {/* Aditional routes will be added here */}
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

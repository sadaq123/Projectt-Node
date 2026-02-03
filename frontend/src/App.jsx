import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RoomExplorer from './components/RoomExplorer';
import FoodMenu from './components/FoodMenu';
import HotelDashboard from './components/HotelDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import UserRequests from './components/UserRequests';
import StaffDashboard from './components/StaffDashboard';
import CashierDashboard from './components/CashierDashboard';
import AccountantDashboard from './components/AccountantDashboard';
import AdminRequests from './components/AdminRequests';
import Login from './pages/Login';
import Register from './pages/Register';

// Qaybtan waa xudunta frontend-ka oo maamusha dhamaan page-yada iyo amniga
function App() {
  return (
    <Router>
      <AuthProvider> {/* Maamulista xogta isticmaalaha ee login-ka ah */}
        <ThemeProvider> {/* Maamulista midabada iyo muuqaalka (Theme) */}
          <div className="App">
            <Navbar /> {/* Baarka sare ee laga dhex socdo website-ka */}
            <Routes>
              {/* Wadooyinka dadka oo dhan u furan */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
              
              {/* Wadooyinka u xiran kaliya dadka login-ka ah (User) */}
              <Route path="/rooms" element={
                <ProtectedRoute>
                  <RoomExplorer />
                </ProtectedRoute>
              } />

              <Route path="/menu" element={
                <ProtectedRoute>
                  <FoodMenu />
                </ProtectedRoute>
              } />

              <Route path="/requests" element={
                <ProtectedRoute>
                  <UserRequests />
                </ProtectedRoute>
              } />

              {/* Wadada Dashboard-ka Shaqaalaha (Staff) */}
              <Route path="/staff" element={
                <ProtectedRoute roles={['staff', 'admin', 'superadmin']}>
                  <StaffDashboard />
                </ProtectedRoute>
              } />

              {/* Wadada Dashboard-ka Khasnajiga (Cashier) */}
              <Route path="/cashier" element={
                <ProtectedRoute roles={['cashier', 'admin', 'superadmin']}>
                  <CashierDashboard />
                </ProtectedRoute>
              } />

              {/* Wadada Dashboard-ka Xisaabiyaha (Accountant) */}
              <Route path="/accountant" element={
                <ProtectedRoute roles={['accountant', 'admin', 'superadmin']}>
                  <AccountantDashboard />
                </ProtectedRoute>
              } />
              
              {/* Wadada Dashboard-ka Maamulka (Admin) */}
              <Route path="/admin" element={
                <ProtectedRoute roles={['admin', 'superadmin']}>
                  <HotelDashboard />
                </ProtectedRoute>
              } />

              {/* Wadada Codsiyada ee Admin-ka */}
              <Route path="/admin/requests" element={
                <ProtectedRoute roles={['admin', 'superadmin']}>
                  <AdminRequests />
                </ProtectedRoute>
              } />

              {/* Wadada Super Admin-ka (Tirtirista iyo Bedelista Role) */}
              <Route path="/superadmin" element={
                <ProtectedRoute roles={['superadmin']}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

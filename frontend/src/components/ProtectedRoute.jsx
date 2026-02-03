import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ProtectedRoute: Qaybtan waxay xaqiijisaa in qofka uusan galin meel uusan ogolaansho u lahayn
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, token } = useAuth(); // Ka soo qaado macluumaadka isticmaalaha Context-ga
  const location = useLocation();

  // Hadii uusan qofka login ahayn (Token ma jiro), dib ugu celi bogga Login-ka
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Hadii qofka uu login yahay laakiin uusan lahayn darajada (role) loo baahan yahay, dib ugu celi Home-ka
  if (roles.length && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  // Hadii wax walba ay sax yihiin, u ogolaaw inuu arko bogga
  return children;
};

export default ProtectedRoute;

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useSelector((store) => store.auth);

  // ⏳ Wait until auth finishes loading
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // 🔒 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Role-based protection (optional)
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

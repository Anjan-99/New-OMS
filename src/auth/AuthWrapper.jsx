import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthWrapper = ({ children }) => {
  const selector = useSelector((state) => state.auth);
  if (!selector?.isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children; // Or return <>{children}</>;
};
export { AuthWrapper };

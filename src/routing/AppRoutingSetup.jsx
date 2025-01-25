import { Navigate, Route, Routes } from "react-router";
import { useSelector } from "react-redux"; // Import useSelector to access Redux store
import { DefaultPage, Demo1DarkSidebarPage } from "@/pages/dashboards";
import { AuthPage } from "@/auth";
import { Demo1Layout } from "@/layouts/demo1";
import { ErrorsRouting } from "@/errors";
import { User_Table_Page } from "@/pages/user";
import { ProfileSettingsPage } from "@/pages/account";
import { Access_ControlPage } from "@/pages/access_control";

// Higher-Order Component for Role-Based Access
const RequireAuth = ({ children, notAllowedRoles = [] }) => {
  const userRole = useSelector((state) => state.auth.user.role);

  if (notAllowedRoles.includes(userRole)) {
    return <Navigate to="/error/unauthorized" />; // Redirect if role is not allowed
  }
  return children;
};

const AppRoutingSetup = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="*" element={<AuthPage />} />
      <Route path="error/*" element={<ErrorsRouting />} />

      {/* Protected Routes */}
      <Route element={<Demo1Layout />}>
        <Route
          path="/dashboard"
          element={
            <RequireAuth notAllowedRoles={[]}>
              <DefaultPage />
            </RequireAuth>
          }
        />
        <Route
          path="/user/user_management"
          element={
            <RequireAuth notAllowedRoles={["Viewer", "Employee"]}>
              <User_Table_Page />
            </RequireAuth>
          }
        />
        <Route
          path="/account/profile_setting"
          element={
            <RequireAuth notAllowedRoles={["guest"]}>
              <ProfileSettingsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/access_control/admin_table"
          element={
            <RequireAuth notAllowedRoles={["Viewer", "Employee"]}>
              <Access_ControlPage />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
};

export { AppRoutingSetup };

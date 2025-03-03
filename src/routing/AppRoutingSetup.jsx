/* eslint-disable react/prop-types */
import { Navigate, Route, Routes } from "react-router";
import { useSelector } from "react-redux"; // Import useSelector to access Redux store
import { DefaultPage } from "@/pages/dashboards";
import { AuthPage } from "@/auth";
import { Demo1Layout } from "@/layouts/demo1";
import { ErrorsRouting } from "@/errors";
import { User_Table_Page } from "@/pages/user";
import { ProfileSettingsPage } from "@/pages/account";
import { Access_ControlPage } from "@/pages/access_control";
import { User_View_Page } from "@/pages/user";
import { User_Group_Page } from "@/pages/user";
import { GroupUpdateContent } from "@/pages/user";
import { Group_Table_Content } from "@/pages/user";
import { AdminUpdateContent } from "@/pages/access_control";
import { LogControlPage } from "@/pages/logs";
import { Oms_Page } from "@/pages/oms";
import { MultiOrder_Page } from "@/pages/multi-order";
import { NetposControlPage } from "@/pages/net_position";
import { HoldingsControlPage } from "@/pages/holding";
// Higher-Order Component for Role-Based Access

const RequireAuth = ({ children, notAllowedRoles = [] }) => {
  const selector = useSelector((state) => state.auth);
  const userRole = selector.user?.role;
  const twofaEnabled = selector.user?.twofa_enabled;
  const otpVerified = selector.otp_verified;
  // Redirect if OTP is not verified but 2FA is enabled
  if (twofaEnabled && !otpVerified) {
    return <Navigate to="/2fa" replace />;
  }
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
          path="/user/user_view"
          element={
            <RequireAuth notAllowedRoles={["Viewer"]}>
              <User_View_Page />
            </RequireAuth>
          }
        />
        <Route
          path="/user/user_create"
          element={
            <RequireAuth notAllowedRoles={["Viewer"]}>
              <User_View_Page />
            </RequireAuth>
          }
        />
        <Route
          path="/user/user_management"
          element={
            <RequireAuth notAllowedRoles={["Viewer"]}>
              <User_Table_Page />
            </RequireAuth>
          }
        />
        <Route
          path="/user/user_group_create"
          element={
            <RequireAuth notAllowedRoles={[]}>
              <User_Group_Page />
            </RequireAuth>
          }
        />
        <Route
          path="/user/user_group"
          element={
            <RequireAuth notAllowedRoles={[]}>
              <Group_Table_Content />
            </RequireAuth>
          }
        />
        <Route
          path="/user/group_update"
          element={
            <RequireAuth notAllowedRoles={[]}>
              <GroupUpdateContent />
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
        <Route
          path="/access_control/admin_update"
          element={
            <RequireAuth notAllowedRoles={["Viewer", "Employee"]}>
              <AdminUpdateContent />
            </RequireAuth>
          }
        />
        <Route
          path="/logs"
          element={
            <RequireAuth notAllowedRoles={["Viewer", "Employee"]}>
              <LogControlPage />
            </RequireAuth>
          }
        />
        <Route
          path="/oms"
          element={
            <RequireAuth notAllowedRoles={[]}>
              <Oms_Page />
            </RequireAuth>
          }
        />
        <Route
          path="/multi-order-oms"
          element={
            <RequireAuth notAllowedRoles={[]}>
              <MultiOrder_Page />
            </RequireAuth>
          }
        />
        <Route
          path="/netpos"
          element={
            <RequireAuth notAllowedRoles={[]}>
              <NetposControlPage />
            </RequireAuth>
          }
        />
        <Route
          path="/holding"
          element={
            <RequireAuth notAllowedRoles={[]}>
              <HoldingsControlPage />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
};

export { AppRoutingSetup };

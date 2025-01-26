import { Navigate, Route, Routes } from "react-router";
import {
  Login,
  ResetPassword,
  ResetPasswordChange,
  ResetPasswordChanged,
  ResetPasswordCheckEmail,
  ResetPasswordEnterEmail,
  Signup,
  TwoFactorAuth,
} from "./pages/jwt";
import { AuthBrandedLayout } from "@/layouts/auth-branded";
import { CheckEmail } from "@/auth/pages/jwt";
import { useSelector } from "react-redux";

const AuthPage = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  // Redirect to the dashboard if logged in
  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Routes>
      <Route element={<AuthBrandedLayout />}>
        <Route index element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/2fa" element={<TwoFactorAuth />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/reset-password/enter-email"
          element={<ResetPasswordEnterEmail />}
        />
        <Route
          path="/reset-password/check-email"
          element={<ResetPasswordCheckEmail />}
        />
        <Route
          path="/reset-password/change"
          element={<ResetPasswordChange />}
        />
        <Route
          path="/reset-password/changed"
          element={<ResetPasswordChanged />}
        />
        <Route path="*" element={<Navigate to="/error/404" />} />
      </Route>
    </Routes>
  );
};

export { AuthPage };

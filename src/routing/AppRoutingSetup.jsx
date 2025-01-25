import { Navigate, Route, Routes } from "react-router";
import { DefaultPage, Demo1DarkSidebarPage } from "@/pages/dashboards";

import { AuthPage } from "@/auth";
import { Demo1Layout } from "@/layouts/demo1";
import { ErrorsRouting } from "@/errors";
import { User_Table_Page } from "@/pages/user";
import { ProfileSettingsPage } from "@/pages/account";
import { Access_ControlPage } from "@/pages/access_control";

const AppRoutingSetup = () => {
  return (
    <Routes>
      {/* <Route element={<AuthWrapper />}>
       
      </Route> */}

      <Route element={<Demo1Layout />}>
        <Route path="/dashboard" element={<DefaultPage />} />
        <Route path="/dark-sidebar" element={<Demo1DarkSidebarPage />} />
        <Route path="/user/user_management" element={<User_Table_Page />} />
        <Route
          path="/account/profile_setting"
          element={<ProfileSettingsPage />}
        />
        <Route
          path="/access_control/admin_table"
          element={<Access_ControlPage />}
        />
      </Route>

      {/* <Route element={<RequireAuth />}> */}

      {/* </Route> */}
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="*" element={<AuthPage />} />
      {/* <Route path="*" element={<Navigate to="/error/404" />} /> */}
    </Routes>
  );
};
export { AppRoutingSetup };

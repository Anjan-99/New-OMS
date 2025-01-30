import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { toAbsoluteUrl } from "@/utils";
import { useSettings } from "@/providers/SettingsProvider";
import { DefaultTooltip, KeenIcon } from "@/components";
import { useLanguage } from "@/i18n";
import { useSelector } from "react-redux";
import { logout } from "../../../store/slices/userSlice";
import { useDispatch } from "react-redux";

import {
  MenuItem,
  MenuLink,
  MenuSub,
  MenuTitle,
  MenuSeparator,
  MenuArrow,
  MenuIcon,
} from "@/components/menu";
const DropdownUser = ({ menuItemRef }) => {
  const selector = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { isRTL } = useLanguage();
  const { settings, storeSettings } = useSettings();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleThemeMode = (event) => {
    const newThemeMode = event.target.checked ? "dark" : "light";
    storeSettings({
      themeMode: newThemeMode,
    });
  };
  const buildHeader = () => {
    return (
      <div className="flex items-center justify-between px-5 py-1.5 gap-1.5">
        <div className="flex items-center gap-2">
          <img
            className="size-9 rounded-full border-2 border-success"
            src={toAbsoluteUrl("/media/avatars/300-2.png")}
            alt=""
          />
          <div className="flex flex-col gap-1.5">
            <Link
              to="/account/profile_setting"
              className="text-sm text-gray-800 hover:text-primary font-semibold leading-none"
            >
              {selector?.username}
            </Link>
            <p
              className="text-xs text-gray-600 font-medium leading-none"
            >
              {selector?.email}
            </p>
          </div>
        </div>
        <span className="badge badge-xs badge-primary badge-outline">Pro</span>
      </div>
    );
  };
  const buildMenu = () => {
    return (
      <Fragment>
        <MenuSeparator />
        <div className="flex flex-col">
          <MenuItem>
            <MenuLink path="/account/profile_setting">
              <MenuIcon className="menu-icon">
                <KeenIcon icon="user" />
              </MenuIcon>
              <MenuTitle>Account</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuSeparator />
        </div>
      </Fragment>
    );
  };
  const buildFooter = () => {
    return (
      <div className="flex flex-col">
        <div className="menu-item mb-0.5">
          <div className="menu-link">
            <span className="menu-icon">
              <KeenIcon icon="moon" />
            </span>
            <span className="menu-title">
              <FormattedMessage id="USER.MENU.DARK_MODE" />
            </span>
            <label className="switch switch-sm">
              <input
                name="theme"
                type="checkbox"
                checked={settings.themeMode === "dark"}
                onChange={handleThemeMode}
                value="1"
              />
            </label>
          </div>
        </div>

        <div className="menu-item px-4 py-1.5">
          <a
            onClick={handleLogout}
            className="btn btn-sm btn-light justify-center"
          >
            <FormattedMessage id="USER.MENU.LOGOUT" />
          </a>
        </div>
      </div>
    );
  };
  return (
    <MenuSub
      className="menu-default light:border-gray-300 w-[200px] md:w-[250px]"
      rootClassName="p-0"
    >
      {buildHeader()}
      {buildMenu()}
      {buildFooter()}
    </MenuSub>
  );
};
export { DropdownUser };

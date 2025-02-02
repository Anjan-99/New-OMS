import { useRef } from "react";
import { toAbsoluteUrl } from "@/utils";
import { Menu, MenuItem, MenuToggle } from "@/components";
import { DropdownUser } from "@/partials/dropdowns/user";
import { useLanguage } from "@/i18n";
import { useSettings } from "@/providers/SettingsProvider";
import { KeenIcon } from "@/components";
import { FormattedMessage } from "react-intl";
import { ShortcutKeysInformation } from "./ShortcutKeysInformation";
import { ColorSettings } from "./ColorSettings";

const HeaderTopbar = () => {
  const { isRTL } = useLanguage();
  const { settings, storeSettings } = useSettings();
  const itemUserRef = useRef(null);

  // Handle theme mode toggle
  const handleThemeMode = (event) => {
    const newThemeMode = event.target.checked ? "dark" : "light";
    storeSettings({ themeMode: newThemeMode });
  };

  return (
    <div className="flex items-center gap-2 lg:gap-3.5">
      {/* User Profile Menu */}
      <ShortcutKeysInformation />
      <ColorSettings />

      {/* Theme Toggle - New Style */}
      <button
        className="btn btn-icon bg-slate-100 border-gray-500 hidden dark:flex"
        data-theme-toggle="true"
        data-tooltip="#theme_mode_light"
        onClick={() => storeSettings({ themeMode: "light" })}
      >
        <i className="ki-solid text-amber-500 text-2xl ki-sun"></i>
      </button>
      <button
        className="btn btn-icon bg-slate-800 border-gray-500  dark:hidden "
        data-theme-toggle="true"
        data-tooltip="#theme_mode_dark"
        onClick={() => storeSettings({ themeMode: "dark" })}
      >
        <i className="ki-solid text-info text-2xl ki-moon"></i>
      </button>
      <div className="tooltip" id="theme_mode_light">
        Switch to Light mode
      </div>
      <div className="tooltip" id="theme_mode_dark">
        Switch to Dark mode
      </div>
      <Menu>
        <MenuItem
          ref={itemUserRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? "bottom-start" : "bottom-end",
            modifiers: [
              {
                name: "offset",
                options: { offset: isRTL() ? [-20, 10] : [20, 10] },
              },
            ],
          }}
        >
          <MenuToggle className="btn btn-icon rounded-full">
            <img
              className="size-9 rounded-full border-2 border-success shrink-0"
              src={toAbsoluteUrl("/media/avatars/300-2.png")}
              alt="User Avatar"
            />
          </MenuToggle>
          {DropdownUser({ menuItemRef: itemUserRef })}
        </MenuItem>
      </Menu>
    </div>
  );
};

export { HeaderTopbar };

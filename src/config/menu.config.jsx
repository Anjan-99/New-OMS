const COMMON_MENUS = {
  dashboards: {
    title: "Dashboards",
    icon: "element-11",
    path: "/dashboard",
  },
  pagesHeading: {
    heading: "Settings",
  },
  userManagement: {
    title: "User Management",
    icon: "users",
    children: [
      {
        title: "User List",
        path: "/user/user_management",
      },
      {
        title: "User Create",
        path: "/user/user_create",
      },
    ],
  },
  userGroup: {
    title: "User Group",
    icon: "people",
    children: [
      {
        title: "Group List",
        path: "/user/user_group",
      },
      {
        title: "Group Create",
        path: "/user/user_group_create",
      },
    ],
  },
  accessControl: {
    title: "Access Control",
    icon: "security-user",
    path: "/access_control/admin_table",
  },
  logs: {
    title: "Logs",
    icon: "data",
    path: "/logs",
  },
  accountSettings: {
    title: "Account Settings",
    icon: "setting",
    path: "/account/profile_setting",
  },
  oms: {
    title: "OMS",
    icon: "setting-3",
    children: [
      {
        title: "Single Order",
        path: "/oms",
      },
      {
        title: "Multi Order",
        path: "/dashboard",
      },
    ],
  },
  net_position: {
    title: "Net Position",
    icon: "grid",
    path : "/netpos"
  },
  holdings : {
    title: "Holdings",
    icon: "abstract-26",
    path : "/holding"
  },
};

export const MENU_SIDEBAR = [
  COMMON_MENUS.dashboards,
  COMMON_MENUS.pagesHeading,
  COMMON_MENUS.userManagement,
  COMMON_MENUS.userGroup,
  COMMON_MENUS.accessControl,
  COMMON_MENUS.logs,
  COMMON_MENUS.accountSettings,
];

export const MENU_PROFITFOLIO = [
  COMMON_MENUS.dashboards,
  COMMON_MENUS.oms,
  COMMON_MENUS.net_position,
  COMMON_MENUS.holdings,
  COMMON_MENUS.pagesHeading,
  COMMON_MENUS.userManagement,
  COMMON_MENUS.userGroup,
  COMMON_MENUS.accessControl,
  COMMON_MENUS.logs,
  COMMON_MENUS.accountSettings,
  
];

export const MENU_EMPLOYEE = [
  COMMON_MENUS.dashboards,
  COMMON_MENUS.oms,
  COMMON_MENUS.net_position,
  COMMON_MENUS.holdings,
  COMMON_MENUS.pagesHeading,
  COMMON_MENUS.userManagement,
  COMMON_MENUS.userGroup,
];

export const MENU_VIEWER = [
  COMMON_MENUS.dashboards,
  COMMON_MENUS.pagesHeading,
  COMMON_MENUS.userGroup,
  COMMON_MENUS.accountSettings,
];

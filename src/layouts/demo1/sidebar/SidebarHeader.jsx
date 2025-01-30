import React, { forwardRef, Fragment } from "react";
import { Link } from "react-router-dom";
import { useDemo1Layout } from "../";
import { toAbsoluteUrl } from "@/utils";
import { SidebarToggle } from "./";
const SidebarHeader = forwardRef((props, ref) => {
  const { layout } = useDemo1Layout();
  const lightLogo = () => (
    <Fragment>
      <Link to="/dashboard" className="dark:hidden">
      <div className="flex items-center default-logo1 gap-2">
          {/* <img
            src={toAbsoluteUrl("/media/app/default-logo1.png")}
            className="default-logo1 min-h-[30px] max-w-[40px]"
          /> */}
          <span className="text-black text-2xl font-semibold">DataEdge</span>
        </div>
        {/* <img
          src={toAbsoluteUrl("/media/app/default-logo1.png")}
          className="small-logo min-h-[22px] max-w-[40px]"
        /> */}
      </Link>
      <Link to="/dashboard" className="hidden dark:block">
        <div className="flex items-center default-logo1 gap-2">
          {/* <img
            src={toAbsoluteUrl("/media/app/default-logo1.png")}
            className="default-logo1 min-h-[30px] max-w-[40px]"
          /> */}
          <span className="text-white text-2xl">DataEdge</span>
        </div>

        <img
          src={toAbsoluteUrl("/media/app/default-logo1.png")}
          className="small-logo min-h-[22px] max-w-[40px]"
        />
      </Link>
    </Fragment>
  );
  const darkLogo = () => (
    <Link to="/dashboard">
      <img
        src={toAbsoluteUrl("/media/app/default-logo1.png")}
        className="default-logo1 min-h-[22px] max-w-[30px]"
      />
      <img
        src={toAbsoluteUrl("/media/app/default-logo1.png")}
        className="small-logo min-h-[22px] max-w-[40px]"
      />
    </Link>
  );
  return (
    <div
      ref={ref}
      className="sidebar-header hidden lg:flex items-center relative justify-between px-3 lg:px-6 shrink-0"
    >
      {layout.options.sidebar.theme === "light" ? lightLogo() : darkLogo()}
      <SidebarToggle />
    </div>
  );
});
export { SidebarHeader };

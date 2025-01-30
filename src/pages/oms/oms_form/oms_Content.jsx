import { useResponsive, useScrollPosition } from "@/hooks";
import { User_View } from "./blocks";
import { useEffect, useRef, useState } from "react";
import { useLayout } from "@/providers";

const stickySidebarClasses = {
  "demo1-layout": "top-[calc(var(--tw-header-height)+1rem)]",
  "demo2-layout": "top-[calc(var(--tw-header-height)+1rem)]",
  "demo3-layout":
    "top-[calc(var(--tw-header-height)+var(--tw-navbar-height)+1rem)]",
  "demo4-layout": "top-[3rem]",
  "demo5-layout": "top-[calc(var(--tw-header-height)+1.5rem)]",
  "demo6-layout": "top-[3rem]",
  "demo7-layout": "top-[calc(var(--tw-header-height)+1rem)]",
  "demo8-layout": "top-[3rem]",
  "demo9-layout": "top-[calc(var(--tw-header-height)+1rem)]",
  "demo10-layout": "top-[1.5rem]",
};
const Oms_Content = () => {
  const desktopMode = useResponsive("up", "lg");
  const { currentLayout } = useLayout();
  const [sidebarSticky, setSidebarSticky] = useState(false);

  // Initialize ref for parentEl
  const parentRef = useRef(document); // Default to document
  const scrollPosition = useScrollPosition({
    targetRef: parentRef,
  });

  // Effect to update parentRef after the component mounts
  useEffect(() => {
    const scrollableElement = document.getElementById("scrollable_content");
    if (scrollableElement) {
      parentRef.current = scrollableElement;
    }
  }, []); // Run only once on component mount

  // Handle scroll position and sidebar stickiness
  useEffect(() => {
    setSidebarSticky(scrollPosition > 100);
  }, [scrollPosition, currentLayout?.options]);

  // Get the sticky class based on the current layout, provide a default if not found
  const stickyClass = currentLayout?.name
    ? stickySidebarClasses[currentLayout.name] ||
      "top-[calc(var(--tw-header-height)+1rem)]"
    : "top-[calc(var(--tw-header-height)+1rem)]";
  return (
    <div className="flex grow gap-5 lg:gap-7.5 shadow-lg rounded-lg">
      <div className="flex flex-col items-stretch grow gap-5 lg:gap-7.5">
        <User_View />
      </div>
    </div>
  );
};
export { Oms_Content };

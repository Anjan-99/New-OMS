import useBodyClasses from "@/hooks/useBodyClasses";
import { AuthWrapper } from "../../auth/AuthWrapper";
import { Demo1LayoutProvider, Main } from "./";
const Demo1Layout = () => {
  // Using the useBodyClasses hook to set background styles for light and dark modes
  useBodyClasses(`
    [--tw-page-bg:#fefefe]
    [--tw-page-bg-dark:var(--tw-coal-500)]
    demo1 
    sidebar-fixed 
    header-fixed 
    bg-[--tw-page-bg]
    dark:bg-[--tw-page-bg-dark]
  `);
  return (
    <AuthWrapper>
      <Demo1LayoutProvider>
        <Main />
      </Demo1LayoutProvider>
    </AuthWrapper>
  );
};
export { Demo1Layout };

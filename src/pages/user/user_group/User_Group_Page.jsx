import { Fragment } from "react";
import { Container } from "@/components/container";
import { GroupCreateContent } from "./Group_create/GroupCreateContent";
// import { Admin_Table_Content } from "./admin_table/Admin_Table_Content";
const User_Group_Page = () => {
  return (
    <Fragment>
      <Container>
        <div className="flex grow gap-5 lg:gap-7.5 ">
          <div className="flex flex-col items-stretch grow gap-5 lg:gap-7.5">
            <GroupCreateContent />
          </div>
        </div>
      </Container>
    </Fragment>
  );
};
export { User_Group_Page };

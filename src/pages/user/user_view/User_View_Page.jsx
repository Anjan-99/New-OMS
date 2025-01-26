import { Fragment } from "react";
import { Container } from "@/components/container";
import { User_View_Content } from "./User_View_Content";
const User_View_Page = () => {
  return (
    <Fragment>
      <Container>
        <User_View_Content />
      </Container>
    </Fragment>
  );
};
export { User_View_Page };

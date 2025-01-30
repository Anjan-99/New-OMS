import { Fragment } from "react";
import { Container } from "@/components/container";
import { Netpos_Table_Content } from "./Netpos/Netpos_Table_Content";
const NetposControlPage = () => {
  return (
    <Fragment>
      <Container>
        <div className="flex grow gap-5 lg:gap-7.5 ">
          <div className="flex flex-col items-stretch grow gap-5 lg:gap-7.5">
            <Netpos_Table_Content />
          </div>
        </div>
      </Container>
    </Fragment>
  );
};
export { NetposControlPage };

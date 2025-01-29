import { Fragment } from "react";
import { Container } from "@/components/container";
import { Log_Table_Content } from "./log_table/Log_Table_Content";
const LogControlPage = () => {
  return (
    <Fragment>
      <Container>
        <div className="flex grow gap-5 lg:gap-7.5 ">
          <div className="flex flex-col items-stretch grow gap-5 lg:gap-7.5">
            <Log_Table_Content />
          </div>
        </div>
      </Container>
    </Fragment>
  );
};
export { LogControlPage };

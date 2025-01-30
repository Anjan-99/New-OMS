import { Fragment } from "react";
import { Container } from "@/components/container";
import { Holding_Table_Content } from "./Holdings/Holdings_Table_Content";
const HoldingsControlPage = () => {
  return (
    <Fragment>
      <Container>
        <div className="flex grow gap-5 lg:gap-7.5 ">
          <div className="flex flex-col items-stretch grow gap-5 lg:gap-7.5">
            <Holding_Table_Content />
          </div>
        </div>
      </Container>
    </Fragment>
  );
};
export { HoldingsControlPage };

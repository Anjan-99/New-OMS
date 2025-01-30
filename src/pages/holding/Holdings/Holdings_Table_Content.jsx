import { Holdings_Table } from "./blocks/Holdings_table";
const Holding_Table_Content = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-7.5 shadow-lg rounded-lg">
      <div className="col-span-12">
        <div className="flex flex-col gap-5 lg:gap-7.5">
          <Holdings_Table />
        </div>
      </div>
    </div>
  );
};
export { Holding_Table_Content };

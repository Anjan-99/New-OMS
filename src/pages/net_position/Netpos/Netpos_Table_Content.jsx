import { Netpos_Table } from "./blocks/Netpos_Table";
const Netpos_Table_Content = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-7.5 shadow-lg rounded-lg">
      <div className="col-span-12">
        <div className="flex flex-col gap-5 lg:gap-7.5">
          <Netpos_Table />
        </div>
      </div>
    </div>
  );
};
export { Netpos_Table_Content };

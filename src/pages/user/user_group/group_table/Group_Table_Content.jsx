import { Group_Table } from "./blocks/Group_Table";
const Group_Table_Content = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-7.5 p-6 pt-0">
      <div className="col-span-12">
        <div className="flex flex-col gap-5 lg:gap-7.5">
          <Group_Table />
        </div>
      </div>
    </div>
  );
};
export { Group_Table_Content };

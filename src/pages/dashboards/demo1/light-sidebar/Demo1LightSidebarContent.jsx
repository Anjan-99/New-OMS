import {
  ChannelStats,
  EarningsChart,
  EntryCallout,
  Highlights,
  TeamMeeting,
  Teams,
} from "./blocks";
import { User_Table } from "@/pages/user/user_table/blocks/User_Table";
import { Group_Table } from "@/pages/user/user_group/group_table/blocks/Group_Table";
const Demo1LightSidebarContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="grid lg:grid-cols-3 gap-y-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">
          <div className="grid grid-cols-2 gap-5 lg:gap-7.5 h-full items-stretch">
            <ChannelStats />
          </div>
        </div>
        <div className="lg:col-span-2">
          <EntryCallout className="h-full" />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">
          <TeamMeeting />
        </div>

        <div className="lg:col-span-2">
          <User_Table limit={5}/>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">
          <Highlights limit={3} />
        </div>
        <div className="lg:col-span-2">
          <Group_Table limit={5}/>
        </div>
      </div>
    </div>
  );
};
export { Demo1LightSidebarContent };




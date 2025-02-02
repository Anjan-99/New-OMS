import { Fragment } from "react";
import { toAbsoluteUrl } from "@/utils/Assets";
import request from "@/services/request";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { User, Users } from "lucide-react";

const ChannelStats = () => {
  const selector = useSelector((state) => state.auth);
  const adminId = selector.user.adminId;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get(`api/user/stats?adminId=${adminId}`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Stats data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const items = [
    {
      icon: User,
      info: `${data.users}`,
      desc: "Total Users",
      path: "",
    },
    {
      icon: Users,
      info: `${data.usergrp}`,
      desc: "Total Users",
      path: "",
    },
    {
      icon: "User",
      info: `${data.users}`,
      desc: "Total Users",
      path: "",
    },
    {
      icon: "User",
      info: `${data.users}`,
      desc: "Total Users",
      path: "",
    },
  ];
  const renderItem = (item, index) => {
    return (
      <div
        key={index}
        className="card flex-col justify-between gap-1 bg-cover rtl:bg-[left_top_-1.7rem] bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg"
      >
        {item.icon && (
          <div className="mt-5">
            <item.icon className="w-20 h-10 text-gray-900" />
          </div>
        )}

        <div className="flex flex-col gap-1 pb-4 px-5">
          <span className="text-3xl font-semibold text-gray-900">
            {item.info}
          </span>
          <span className="text-2sm font-normal text-gray-700">
            {item.desc}
          </span>
        </div>
      </div>
    );
  };
  return (
    <Fragment>
      <style>
        {`
          .channel-stats-bg {
            background-image: url('${toAbsoluteUrl("/media/images/2600x1600/bg-3.png")}');
          }
          .dark .channel-stats-bg {
            background-image: url('${toAbsoluteUrl("/media/images/2600x1600/bg-3-dark.png")}');
          }
        `}
      </style>

      {items.map((item, index) => {
        return renderItem(item, index);
      })}
    </Fragment>
  );
};
export { ChannelStats };
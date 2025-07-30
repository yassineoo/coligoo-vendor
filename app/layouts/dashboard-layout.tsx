import { Outlet } from "react-router";
import SideBar from "~/components/side-bar";
import TopBar from "~/components/top-bar";

export default function DashboardLayout() {
  return (
    <div className="flex  ">
      <div className="basis-[20%] sticky top-0 bg-white h-screen">
        <SideBar />
      </div>
      <div className=" basis-[80%] relative overflow-x-hidden   ">
        <div className=" sticky top-0 bg-white     z-10">
          <TopBar />
        </div>
        <div className="  py-4 px-6  ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

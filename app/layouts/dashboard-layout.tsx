import { Outlet } from "react-router";
import SideBar from "~/components/side-bar";
import TopBar from "~/components/top-bar";

export default function DashboardLayout() {
  return (
    <div className="flex  ">
      <div className="w-64 sticky top-0 bg-white h-screen">
        <SideBar />
      </div>
      <div className="w-full">
        <div className=" sticky top-0 z-10 bg-white">
          <TopBar />
        </div>
        <div className=" w-full py-4 px-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

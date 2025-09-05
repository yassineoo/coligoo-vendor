import { Spin } from "antd";
import { Navigate, Outlet } from "react-router";
import AuthSpin from "~/components/auth/auth-spin";
import SideBar from "~/components/side-bar";
import TopBar from "~/components/top-bar";
import UseCheckAuth from "~/hooks/check-auth/use-check-auth";

export default function DashboardLayout() {
  // auth check
  const { isAuthenticated, isChecking, isGettingInfos } = UseCheckAuth();

  if (isChecking || isGettingInfos) {
    return <AuthSpin />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated) {
    return (
      <div className="flex  ">
        <div className="basis-[17%] sticky top-0 bg-white h-screen">
          <SideBar />
        </div>
        <div className=" basis-[83%] relative overflow-x-hidden   ">
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
  return <div></div>;
}

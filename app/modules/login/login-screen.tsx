import authBg from "assets/auth-bg.png";
import authCard from "assets/auth-card.png";
import LoginForm from "./login-form";
import UseCheckAuth from "~/hooks/check-auth/use-check-auth";
import AuthSpin from "~/components/auth/auth-spin";
import { Navigate } from "react-router";

export default function LoginScreen() {
  const { isAuthenticated, isChecking, isGettingInfos } = UseCheckAuth();
  if (isChecking || isGettingInfos) {
    return <AuthSpin />;
  }
  if (isAuthenticated) {
    return <Navigate to="/dashboard/home" replace />;
  }
  return (
    <div className=" flex min-h-screen ">
      <div className=" basis-1/2">
        <LoginForm />
      </div>
      <div className=" relative  basis-1/2 flex items-center justify-center">
        <img
          className=" w-[70%] relative z-10 "
          src={authCard}
          alt="auth card"
        />
        <img
          className="inset-0 h-full w-full absolute"
          src={authBg}
          alt="auth bg"
        />
      </div>
    </div>
  );
}

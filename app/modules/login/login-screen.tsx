import authBg from "assets/auth-bg.png";
import authCard from "assets/auth-card.png";
import LoginForm from "./login-form";

export default function LoginScreen() {
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

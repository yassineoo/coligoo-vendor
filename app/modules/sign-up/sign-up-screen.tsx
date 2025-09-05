import authBg from "assets/auth-bg.png";
import authCard from "assets/auth-card.png";
import SignUpForm from "./sign-up-form";

export default function SignUpScreen() {
  return (
    <div className=" flex min-h-screen ">
      <div className=" basis-1/2">
        <SignUpForm />
      </div>
      <div className=" sticky top-0 h-screen basis-1/2 flex items-center justify-center">
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

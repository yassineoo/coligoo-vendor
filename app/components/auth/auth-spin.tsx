import { Spin } from "antd";

export default function AuthSpin() {
  return (
    <div className=" flex flex-col justify-center items-center min-h-screen gap-4 ">
      <Spin size="large" />
      <span>Authenticating...</span>
    </div>
  );
}

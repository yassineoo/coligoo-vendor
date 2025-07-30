import { Form, Input, Button } from "antd";
import mainLogo from "assets/main-logo.svg";
import { loginFormRules, type LoginFormData } from "./login-schema";
import { Link } from "react-router";
import Label from "~/components/label";

export default function LoginForm() {
  const [form] = Form.useForm();

  const handleSubmit = (values: LoginFormData) => {};

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto">
      {/* Logo */}
      <div className="mb-8">
        <img src={mainLogo} alt="Main Logo" className="w-24" />
      </div>

      {/* Sign In Form */}
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1>Sign In</h1>
          <p className="">
            Don't have an account?{" "}
            <Link to="/sign-up" className=" text-orange underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
          className="w-full"
        >
          {/* Email Field */}
          <Form.Item
            label={<Label>Email</Label>}
            name="email"
            rules={loginFormRules.email}
          >
            <Input placeholder="hamzaabouchanane@gmail.com" />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label={<Label>Password</Label>}
            name="password"
            rules={loginFormRules.password}
          >
            <Input.Password placeholder="*******" />
          </Form.Item>

          {/* Forgot Password Link */}
          <div className="text-right mb-6">
            <Link to={"/forget-password"} className="text-sm !text-gray-500">
              Forget Password?
            </Link>
          </div>

          {/* Submit Button */}
          <Form.Item className="mb-0">
            <Button
              className="  !bg-orange !text-lg !text-white !border-orange hover:!border-orange"
              htmlType="submit"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

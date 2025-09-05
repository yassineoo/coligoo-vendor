import { Form, Input, Button, notification } from "antd";
import mainLogo from "assets/main-logo.svg";
import { loginFormRules, type LoginFormData } from "./login-schema";
import { Link, useNavigate } from "react-router";
import Label from "~/components/label";
import { useMutation } from "@tanstack/react-query";
import { loginVendor } from "./api/login-vendor";
import { saveToken } from "~/utils/manage-token";
import { useAppDispatch } from "~/redux/hooks";
import { setUser } from "../sign-up/redux/user-slice";

export default function LoginForm() {
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationFn: loginVendor,
    onSuccess: (data) => {
      // Invalidate and refetch
      console.log("Response Data:", data);
      saveToken(data?.data?.token);
      dispatch(setUser(data?.data?.userInfo));
      notification.success({
        message: "Success",
        description: data?.data?.msg || "Login successful!",
      });
      navigate("/dashboard/home", { replace: true });
    },
    onError: (error: any) => {
      console.error("Error Details:", error);
      notification.error({
        message: "Error",
        description:
          error?.response?.data?.fr || "Something went wrong. Try again.",
      });
    },
  });

  const handleSubmit = (values: LoginFormData) => {
    mutation.mutate(values);
  };

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
          requiredMark={false}
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
            <Link to={"/reset-password"} className="text-sm !text-gray-500">
              Forget Password?
            </Link>
          </div>

          {/* Submit Button */}
          <Form.Item className="mb-0">
            <Button
              loading={mutation.isPending}
              disabled={mutation.isPending}
              type="primary"
              htmlType="submit"
            >
              {mutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

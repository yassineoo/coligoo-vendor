import { Form, Input, Button, Checkbox, App } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import mainLogo from "assets/main-logo.svg";
import { Link, useNavigate } from "react-router";
import type { SignUpFormData } from "./sign-up-schema";
import { signUpFormRules } from "./sign-up-schema";
import { useMutation } from "@tanstack/react-query";
import { registerVendor } from "./api/sign-up-api";
import { saveToken } from "~/utils/manage-token";
import { useAppDispatch } from "~/redux/hooks";
import { setUser } from "./redux/user-slice";

export default function SignUpForm() {
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: registerVendor,
    onSuccess: (data) => {
      // Invalidate and refetch
      console.log("Response Data:", data);
      saveToken(data?.data?.token);
      dispatch(setUser(data?.data?.userInfo));
      notification.success({
        message: "Success",
        description: data?.data?.msg || "Account created successfully!",
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

  const handleSubmit = (values: SignUpFormData) => {
    mutation.mutate(values);
  };

  const handleConfirmPasswordValidation = ({ getFieldValue }: any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Passwords do not match!"));
    },
  });

  return (
    <div className="flex flex-col py-12 items-center justify-center h-full max-w-sm mx-auto">
      {/* Logo */}
      <div className="mb-8">
        <img src={mainLogo} alt="Main Logo" className="w-24" />
      </div>

      {/* Sign Up Form */}
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1
            className="text-3xl font-semibold mb-3"
            style={{ color: "#FF5901" }}
          >
            Sign Up
          </h1>
          <p className="text-base">
            Already have an account?{" "}
            <Link to="/" className="text-black underline">
              Log in
            </Link>
          </p>
        </div>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="w-full"
          size="large"
          requiredMark={false} // Add this prop to hide asterisks for this form
        >
          {/* Full Name Field */}
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={signUpFormRules.fullName}
          >
            <Input placeholder="Hamza Bendahmane" />
          </Form.Item>

          {/* Email Field */}
          <Form.Item label="Email" name="email" rules={signUpFormRules.email}>
            <Input placeholder="hamzaabouchanane@gmail.com" />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label="Password"
            name="password"
            rules={signUpFormRules.password}
          >
            <Input.Password
              placeholder="*******"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          {/* Confirm Password Field */}
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              ...signUpFormRules.confirmPassword,
              handleConfirmPasswordValidation,
            ]}
          >
            <Input.Password
              placeholder="*******"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={mutation.isPending}
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

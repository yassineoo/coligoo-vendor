import { Form, Input, Button, Checkbox } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import mainLogo from "assets/main-logo.svg";
import { Link } from "react-router";
import type { SignUpFormData } from "./sign-up-schema";
import { signUpFormRules } from "./sign-up-schema";

export default function SignUpForm() {
  const [form] = Form.useForm();

  const handleSubmit = (values: SignUpFormData) => {};

  const handleConfirmPasswordValidation = ({ getFieldValue }: any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Passwords do not match!"));
    },
  });

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto">
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
        >
          {/* Full Name Field */}
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={signUpFormRules.fullName}
          >
            <Input placeholder="hamza bouchanane" />
          </Form.Item>

          {/* Phone Number Field */}
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={signUpFormRules.phoneNumber}
          >
            <Input placeholder="05555555551" />
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

          {/* CAPTCHA Field */}
          <Form.Item
            label="Introduisez le code sur l'image"
            name="captcha"
            rules={signUpFormRules.captcha}
          >
            <div className="space-y-2">
              {/* CAPTCHA Image Placeholder */}
              <div className="w-48 h-18 bg-gray-200 rounded-lg flex items-center justify-center border">
                <span className="text-gray-500 text-sm">CAPTCHA Image</span>
              </div>
              <Input placeholder="Enter CAPTCHA" />
            </div>
          </Form.Item>

          {/* Terms Agreement */}
          <Form.Item
            name="agreeToTerms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error("You must agree to the terms")),
              },
            ]}
          >
            <Checkbox>
              I'm agree to The Terms of Service and Privacy Policy
            </Checkbox>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              className="  !bg-orange !text-lg !text-white !border-orange hover:!border-orange"
              htmlType="submit"
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

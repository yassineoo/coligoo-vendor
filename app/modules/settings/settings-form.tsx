import { Button, Form, Input, Upload, type FormProps } from "antd";
import type { SettingsFormType } from "./settings-schema";
import { UploadOutlined } from "@ant-design/icons";

export default function SettingsForm({
  initialValues,
}: { initialValues?: SettingsFormType } = {}) {
  const [form] = Form.useForm<SettingsFormType>();
  const onFinish: FormProps<SettingsFormType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed: FormProps<SettingsFormType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="bg-gray p-6 rounded-2xl space-y-8 ">
      <Form
        requiredMark={false}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={initialValues}
        layout="vertical"
        size="large"
        className="space-y-4"
        form={form}
      >
        <Form.Item<SettingsFormType>
          label="Avatar"
          name="avatar"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload
            name="avatar"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Upload new photo</Button>
          </Upload>
        </Form.Item>
        <Form.Item<SettingsFormType>
          label="Full Address"
          name="fullAddress"
          rules={[
            { required: true, message: "Please input your full address!" },
          ]}
        >
          <Input />
        </Form.Item>
        <div className="flex gap-4">
          <Form.Item<SettingsFormType>
            label="First Name"
            name="firstName"
            className="basis-1/2"
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<SettingsFormType>
            label="Last Name"
            name="lastName"
            className="basis-1/2"
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
          >
            <Input />
          </Form.Item>
        </div>
        <Form.Item<SettingsFormType>
          label="Phone Number"
          name="phone"
          rules={[
            { required: true, message: "Please input your phone number!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<SettingsFormType>
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input type="email" />
        </Form.Item>
        <div className="flex gap-4">
          <Form.Item<SettingsFormType>
            label="Password"
            name="password"
            className="basis-1/2"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item<SettingsFormType>
            label="Reset Password"
            name="resetPassword"
            className="basis-1/2"
            rules={[
              { required: true, message: "Please input your reset password!" },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </div>

        <div className="flex justify-center gap-2">
          <Button>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Validate
          </Button>
        </div>
      </Form>
    </div>
  );
}

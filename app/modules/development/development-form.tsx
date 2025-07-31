import { Button, Form, Input, Select, type FormProps } from "antd";
import Label from "~/components/label";
import type { DevelopmentType } from "./development-schema";

export default function DevelopmentForm({
  initialValues,
}: {
  initialValues?: DevelopmentType;
}) {
  const [form] = Form.useForm<DevelopmentType>();
  const onFinish: FormProps<DevelopmentType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<DevelopmentType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className=" bg-gray p-6 rounded-2xl space-y-8 ">
      <h2>Customer information</h2>
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
        <div className="flex gap-4">
          <Form.Item<DevelopmentType>
            label={<Label>Secret Live Environment</Label>}
            name="secretLiveEnvironment"
            className="basis-1/2"
            rules={[
              {
                required: true,
                message: "Please input your secret live environment!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<DevelopmentType>
            label={<Label>Secret Test Environment</Label>}
            name="secretTestEnvironment"
            className="basis-1/2"
            rules={[
              {
                required: true,
                message: "Please input your secret test environment!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="flex gap-4">
          <Form.Item<DevelopmentType>
            label={<Label>Public Live Environment</Label>}
            name="publicLiveEnvironment"
            className="basis-1/2"
            rules={[
              {
                required: true,
                message: "Please input your public live environment!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<DevelopmentType>
            label={<Label>Public Test Environment</Label>}
            name="publicTestEnvironment"
            className="basis-1/2"
            rules={[
              {
                required: true,
                message: "Please input your public test environment!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="flex justify-center gap-2">
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </div>
      </Form>
    </div>
  );
}

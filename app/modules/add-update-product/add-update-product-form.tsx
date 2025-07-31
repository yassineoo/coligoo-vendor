import {
  Button,
  Checkbox,
  Form,
  Input,
  Radio,
  Select,
  type FormProps,
} from "antd";
import Label from "~/components/label";
import type { AddUpdateProductFormType } from "./add-update-product-schema";

const { Option } = Select;
const { TextArea } = Input;

export default function AddUpdateProductForm({
  initialValues,
}: {
  initialValues?: AddUpdateProductFormType;
}) {
  const [form] = Form.useForm<AddUpdateProductFormType>();
  const onFinish: FormProps<AddUpdateProductFormType>["onFinish"] = (
    values
  ) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<AddUpdateProductFormType>["onFinishFailed"] =
    (errorInfo) => {
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
          <Form.Item<AddUpdateProductFormType>
            label={<Label>Product Name</Label>}
            name="productName"
            className="basis-1/2"
            rules={[
              { required: true, message: "Please input your product name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<AddUpdateProductFormType>
            label={<Label>Product Alias</Label>}
            name="productAlias"
            className="basis-1/2"
            rules={[
              { required: true, message: "Please input your product alias!" },
            ]}
          >
            <Input />
          </Form.Item>
        </div>
        <div className="flex gap-4">
          <Form.Item<AddUpdateProductFormType>
            name="category"
            label={<Label>Category</Label>}
            rules={[{ required: true }]}
            className="basis-1/2"
          >
            <Select
              placeholder="Select a option and change input text above"
              allowClear
            >
              <Option value="male">Some</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item<AddUpdateProductFormType>
            name="description"
            className="basis-1/2"
            label={<Label>Description</Label>}
          >
            <TextArea rows={4} />
          </Form.Item>
        </div>
        <div className="flex gap-4">
          <Form.Item<AddUpdateProductFormType>
            name="price"
            label={<Label>Price</Label>}
            rules={[{ required: true }]}
            className="basis-1/2"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item<AddUpdateProductFormType>
            label={<Label>Quantity</Label>}
            name="quantity"
            className="basis-1/2"
            rules={[
              {
                required: true,
                message: "Please input your product quantity!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="flex  flex-col">
          {/* check box for the reset */}
          <Form.Item<AddUpdateProductFormType>
            name="hasVariants"
            valuePropName="checked"
            className="!m-0"
          >
            <Checkbox>Has Variants</Checkbox>
          </Form.Item>
          <Form.Item<AddUpdateProductFormType>
            name="showAlias"
            valuePropName="checked"
          >
            <Checkbox>Show Alias</Checkbox>
          </Form.Item>
        </div>
        <div className="flex justify-center gap-2">
          <Button type="primary" htmlType="submit">
            Add Product
          </Button>
        </div>
      </Form>
    </div>
  );
}

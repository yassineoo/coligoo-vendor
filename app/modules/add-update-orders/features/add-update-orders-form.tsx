import { Button, Form, Input, Radio, Select, type FormProps } from "antd";
import type { AddUpdateOrderFormType } from "../add-update-orders-schema";
import Label from "~/components/label";

const { Option } = Select;
const { TextArea } = Input;

export default function AddUpdateOrdersForm({
  initialValues,
}: {
  initialValues?: AddUpdateOrderFormType;
}) {
  const onFinish: FormProps<AddUpdateOrderFormType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<AddUpdateOrderFormType>["onFinishFailed"] = (
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
      >
        <div className="flex gap-4">
          <Form.Item<AddUpdateOrderFormType>
            label={<Label>First Name</Label>}
            name="firstName"
            className="basis-1/2"
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<AddUpdateOrderFormType>
            label={<Label>Last Name</Label>}
            name="lastName"
            className="basis-1/2"
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
          >
            <Input />
          </Form.Item>
        </div>
        <div className="flex gap-4">
          <Form.Item<AddUpdateOrderFormType>
            label={<Label>Phone Number 1</Label>}
            name="phoneNumberOne"
            rules={[
              { required: true, message: "Please input your phone number!" },
              { len: 10, message: "Phone number must be 10 digits long!" },
            ]}
            className="basis-1/2"
          >
            <Input />
          </Form.Item>
          <Form.Item<AddUpdateOrderFormType>
            label={<Label>Phone Number 2</Label>}
            name="phoneNumberTwo"
            rules={[
              { required: true, message: "Please input your phone number!" },
              { len: 10, message: "Phone number must be 10 digits long!" },
            ]}
            className="basis-1/2"
          >
            <Input />
          </Form.Item>
        </div>
        <div className="flex gap-4">
          <Form.Item<AddUpdateOrderFormType>
            name="wilaya"
            label={<Label>Wilaya</Label>}
            rules={[{ required: true }]}
            className="basis-1/2"
          >
            <Select
              placeholder="Select a option and change input text above"
              allowClear
            >
              <Option value="male">Alger</Option>
              <Option value="other">Bordj Bou Arreridj</Option>
            </Select>
          </Form.Item>
          <Form.Item<AddUpdateOrderFormType>
            name="commune"
            label={<Label>Commune</Label>}
            rules={[{ required: true }]}
            className="basis-1/2"
          >
            <Select
              placeholder="Select a option and change input text above"
              allowClear
            >
              <Option value="male">Alger</Option>
              <Option value="other">Bordj Bou Arreridj</Option>
            </Select>
          </Form.Item>
        </div>
        <Form.Item<AddUpdateOrderFormType>
          label={<Label>Full Address</Label>}
          name="address"
          rules={[
            { required: true, message: "Please input your full address!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<AddUpdateOrderFormType>
          name="product"
          label={<Label>Product</Label>}
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select a option and change input text above"
            allowClear
          >
            <Option value="male">Watch x5</Option>
            <Option value="other">watch x7</Option>
          </Select>
        </Form.Item>
        <Form.Item<AddUpdateOrderFormType>
          name="note"
          label={<Label>Note</Label>}
        >
          <TextArea rows={4} />
        </Form.Item>
        <h2>Validation</h2>
        <div>
          <div className="flex gap-4">
            <Form.Item<AddUpdateOrderFormType>
              name="orderType"
              label={<Label>Order Type</Label>}
            >
              <Radio.Group>
                <Radio value="domicile"> Domicile </Radio>
                <Radio value="stopdesk"> Stop Desk </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item<AddUpdateOrderFormType>
              name="orderTypeTwo"
              label={<Label>Order Type</Label>}
            >
              <Radio.Group>
                <Radio value="normal"> Normal </Radio>
                <Radio value="exchange"> Exchange </Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          <div className="flex gap-2">
            <Form.Item<AddUpdateOrderFormType>
              label={<Label>Return Fees</Label>}
              name="returnFees"
              rules={[
                { required: true, message: "Please input the return fees!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<AddUpdateOrderFormType>
              label={<Label>Delivery Cost</Label>}
              name="deliveryCost"
              rules={[
                { required: true, message: "Please input the delivery cost!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<AddUpdateOrderFormType>
              label={<Label>Subtotal</Label>}
              name="subtotal"
              rules={[
                { required: true, message: "Please input the subtotal!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<AddUpdateOrderFormType>
              label={<Label>Total to Collect</Label>}
              name="totalToCollect"
              rules={[
                {
                  required: true,
                  message: "Please input the total to collect!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <Button>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}

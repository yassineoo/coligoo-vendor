import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  Form,
  Input,
  App,
  Radio,
  Select,
  type FormProps,
} from "antd";
import { useTranslation } from "react-i18next";
import Label from "~/components/label";
import type { Product } from "~/types/global";
import { addUpdateProduct } from "./api/add-update-product";

const { Option } = Select;
const { TextArea } = Input;

type AddUpdateProductFormProps = {
  product?: Product;
  type: "add" | "update";
};

export default function AddUpdateProductForm({
  product,
  type = "add",
}: AddUpdateProductFormProps) {
  const [form] = Form.useForm<Product>();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { notification } = App.useApp();

  const mutation = useMutation({
    mutationFn: ({
      product,
      type,
    }: {
      product: Product;
      type: "add" | "update";
    }) => addUpdateProduct(product, type),
    onSuccess: (data) => {
      // Invalidate and refetch
      console.log("Response Data:", data);
      notification.success({
        message: "Success",
        description: data?.data?.msg || "Product added successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["Product", { id: data.data.id.toString() }],
      });
    },
    onError: (error: any) => {
      console.error("Error Details:", error);
      notification.error({
        message: "Error",
        description:
          error?.response?.data?.message || "Something went wrong. Try again.",
      });
    },
  });

  const onFinish: FormProps<Product>["onFinish"] = (values) => {
    console.log("Success:", values);

    mutation.mutate({ product: values, type });
  };

  return (
    <div className=" bg-gray p-6 rounded-2xl space-y-8 ">
      <h2>{t("add_product.title")}</h2>
      <Form
        requiredMark={false}
        onFinish={onFinish}
        initialValues={product}
        layout="vertical"
        size="large"
        className="space-y-4"
        form={form}
      >
        <Form.Item<Product> name="id" className="basis-1/2 !hidden">
          <Input />
        </Form.Item>
        <div className="flex gap-4">
          <Form.Item<Product>
            label={<Label>{t("add_product.product_name")}</Label>}
            name="productName"
            className="basis-1/2"
            rules={[
              {
                required: true,
                message: t("add_product.validation.product_name_required"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<Product>
            label={<Label>{t("add_product.product_alias")}</Label>}
            name="productAlias"
            className="basis-1/2"
            rules={[
              {
                required: true,
                message: t("add_product.validation.product_alias_required"),
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>
        <div className="flex gap-4">
          {/* fill the most used categories in ecommerce  */}
          <Form.Item<Product>
            name="category"
            label={<Label>{t("add_product.category")}</Label>}
            rules={[
              {
                required: true,
                message: t("add_product.validation.category_required"),
              },
            ]}
            className="basis-1/2"
          >
            <Select placeholder={t("add_product.select_category")} allowClear>
              <Option value="Electronics">
                {t("add_product.categories.electronics")}
              </Option>
              <Option value="Clothing">
                {t("add_product.categories.clothing")}
              </Option>
              <Option value="Home & Garden">
                {t("add_product.categories.home_garden")}
              </Option>
              <Option value="Sports & Outdoors">
                {t("add_product.categories.sports_outdoors")}
              </Option>
              <Option value="Books">{t("add_product.categories.books")}</Option>
              <Option value="Toys & Games">
                {t("add_product.categories.toys_games")}
              </Option>
              <Option value="Health & Beauty">
                {t("add_product.categories.health_beauty")}
              </Option>
              <Option value="Automotive">
                {t("add_product.categories.automotive")}
              </Option>
              <Option value="Jewelry">
                {t("add_product.categories.jewelry")}
              </Option>
              <Option value="Food & Beverages">
                {t("add_product.categories.food_beverages")}
              </Option>
            </Select>
          </Form.Item>
          <Form.Item<Product>
            name="description"
            className="basis-1/2"
            label={<Label>{t("add_product.description")}</Label>}
            rules={[
              {
                required: true,
                message: t("add_product.validation.description_required"),
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </div>
        <div className="flex gap-4">
          <Form.Item<Product>
            name="price"
            label={<Label>{t("add_product.price")}</Label>}
            rules={[
              {
                required: true,
                message: t("add_product.validation.price_required"),
              },
            ]}
            className="basis-1/2"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item<Product>
            label={<Label>{t("add_product.quantity")}</Label>}
            name="quantity"
            className="basis-1/2"
            rules={[
              {
                required: true,
                message: t("add_product.validation.quantity_required"),
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="flex  flex-col">
          {/* check box for the reset */}
          <Form.Item<Product>
            name="hasVariables"
            valuePropName="checked"
            className="!m-0"
          >
            <Checkbox>{t("add_product.has_variables")}</Checkbox>
          </Form.Item>
          <Form.Item<Product> name="showAliasInOrder" valuePropName="checked">
            <Checkbox>{t("add_product.show_alias_in_order")}</Checkbox>
          </Form.Item>
        </div>
        <div className="flex justify-center gap-2">
          <Button
            loading={mutation.isPending}
            disabled={mutation.isPending}
            type="primary"
            htmlType="submit"
          >
            {mutation.isPending
              ? type === "add"
                ? t("add_product.adding")
                : t("add_product.updating")
              : type === "add"
                ? t("add_product.add_product")
                : t("add_product.update_product")}
          </Button>
        </div>
      </Form>
    </div>
  );
}

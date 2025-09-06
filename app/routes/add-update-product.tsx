import { useParams } from "react-router";
import AddUpdateProductScreen from "~/modules/add-update-product/add-update-product-screen";

export default function AddUpdateProduct() {
  const { id } = useParams();
  return <AddUpdateProductScreen id={id} />;
}

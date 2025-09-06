import axios from "axios";
import { API_URL } from "~/utils/constants";
import { getHeaders } from "~/utils/get-header";

export function getAllProducts() {
  const headers = getHeaders();
  return axios.get(`${API_URL}/products`, { headers });
}

export function deleteProduct(id: number) {
  console.log("Deleting product with ID:", id);
  const headers = getHeaders();
  return axios.delete(`${API_URL}/products/${id}`, { headers });
}

import axios from "axios";
import type { Product } from "~/types/global";
import { API_URL } from "~/utils/constants";
import { getHeaders } from "~/utils/get-header";

export function addUpdateProduct(values: Product, type: "add" | "update") {
  const headers = getHeaders();
  console.log("Form Values:", values);
  const transformedData = {
    ...values,
    price: Number(values.price), // Convert to number
    quantity: Number(values.quantity), // Convert to number
  };
  if (type === "add") {
    return axios.post(`${API_URL}/products`, transformedData, {
      headers,
    });
  } else {
    return axios.patch(`${API_URL}/products/${values.id}`, transformedData, {
      headers,
    });
  }
}

export function getProductById(id?: string) {
  if (!id) return null;
  const headers = getHeaders();
  return axios.get(`${API_URL}/products/${id}`, { headers });
}

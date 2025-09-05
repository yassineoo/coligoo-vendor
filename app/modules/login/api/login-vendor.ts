import axios from "axios";
import type { LoginFormData } from "../login-schema";
import { API_URL } from "~/utils/constants";

export function loginVendor(values: LoginFormData) {
  return axios.post(`${API_URL}/auth/login`, values, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

import { API_URL } from "~/utils/constants";
import type { SignUpFormData } from "../sign-up-schema";
import axios from "axios";

export function registerVendor(values: SignUpFormData) {
  const { confirmPassword, ...rest } = values;

  return axios.post(`${API_URL}/auth/register-vendor`, rest, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

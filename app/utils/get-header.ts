import { getToken } from "./manage-token";

export function getHeaders() {
  const token = getToken();
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {
    Authorization: `Bearer `,
  };
}

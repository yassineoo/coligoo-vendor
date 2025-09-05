import { useEffect, useState } from "react";
import { setUser } from "~/modules/sign-up/redux/user-slice";
import { useAppDispatch } from "~/redux/hooks";
import { API_URL } from "~/utils/constants";
import { getHeaders } from "~/utils/get-header";
import { getToken } from "~/utils/manage-token";

export default function UseCheckAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isGettingInfos, setIsGettingInfos] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsAuthenticated(false);
      setIsChecking(false);
    }
    if (token) {
      const headers = getHeaders();
      fetch(`${API_URL}/auth/check-auth`, {
        headers,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.success) {
            setIsAuthenticated(true);
            setIsChecking(false);
          }
        })
        .catch((err) => {
          setIsAuthenticated(false);
          setIsChecking(false);
          console.error("Auth Check Error:", err);
        });
    }

    if (isAuthenticated) {
      setIsGettingInfos(true);
      const headers = getHeaders();
      fetch(`${API_URL}/users/user-info`, {
        headers,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.id) {
            // Handle successful vendor info retrieval
            dispatch(setUser(data));
            setIsGettingInfos(false);
          }
        })
        .catch((err) => {
          console.error("Get Vendor Info Error:", err);
        });
    }
  }, []);
  return { isAuthenticated, isChecking, isGettingInfos } as const;
}

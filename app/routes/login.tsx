import LoginScreen from "~/modules/login/login-screen";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Login" }];
}

export default function Login() {
  return <LoginScreen />;
}

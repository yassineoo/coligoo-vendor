import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  route("/sign-up", "routes/sign-up.tsx"),
] satisfies RouteConfig;

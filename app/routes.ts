import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("./routes/login.tsx"),
  route("/sign-up", "./routes/sign-up.tsx"),
  layout("layouts/dashboard-layout.tsx", [
    route("/dashboard/home", "./routes/home.tsx"),
  ]),
] satisfies RouteConfig;

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
    route("/dashboard/order-lists", "./routes/order-lists.tsx"),
    route(
      "/dashboard/order-lists/add-update-orders",
      "./routes/add-update-orders.tsx"
    ),
    route("/dashboard/products", "./routes/products.tsx"),
    route(
      "/dashboard/products/add-update-product",
      "./routes/add-update-product.tsx"
    ),
    route("/dashboard/returned", "./routes/returned.tsx"),
    route("/dashboard/payment", "./routes/payment.tsx"),
    route("/dashboard/price-applied", "./routes/price-applied.tsx"),
    route("/dashboard/development", "./routes/development.tsx"),
    route("/dashboard/settings", "./routes/settings.tsx"),
  ]),
] satisfies RouteConfig;

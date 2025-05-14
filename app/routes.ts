import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/modules", "routes/modules.tsx"),
  route("/modules/:id", "routes/modules.$id.tsx")
] satisfies RouteConfig;

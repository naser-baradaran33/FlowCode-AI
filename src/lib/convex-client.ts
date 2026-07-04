import { ConvexHttpClient } from "convex/browser";

let convexClient: ConvexHttpClient | null = null;

const getConvexDeploymentUrl = () => {
  const deploymentUrl =
    process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL;

  if (!deploymentUrl) {
    throw new Error(
      "Missing Convex deployment URL. Set NEXT_PUBLIC_CONVEX_URL (and CONVEX_URL for server runtime)."
    );
  }

  return deploymentUrl;
};

const getConvexClient = () => {
  if (!convexClient) {
    convexClient = new ConvexHttpClient(getConvexDeploymentUrl());
  }

  return convexClient;
};

const query: ConvexHttpClient["query"] = (...args) =>
  getConvexClient().query(...args);

const mutation: ConvexHttpClient["mutation"] = (...args) =>
  getConvexClient().mutation(...args);

const action: ConvexHttpClient["action"] = (...args) =>
  getConvexClient().action(...args);

export const convex = {
  query,
  mutation,
  action,
};

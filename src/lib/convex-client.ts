import { ConvexHttpClient } from "convex/browser";

let convexClient: ConvexHttpClient | null = null;

const getConvexDeploymentUrl = () => {
  const deploymentUrl =
    process.env.NEXT_PUBLIC_CONVEX_URL?.trim() ??
    process.env.CONVEX_URL?.trim();

  if (
    deploymentUrl &&
    deploymentUrl !== "undefined" &&
    deploymentUrl !== "null"
  ) {
    return deploymentUrl;
  }

  const convexDeployment = process.env.CONVEX_DEPLOYMENT?.trim();

  if (
    convexDeployment &&
    convexDeployment !== "undefined" &&
    convexDeployment !== "null"
  ) {
    return `https://${convexDeployment}.convex.cloud`;
  }

  throw new Error(
    "Missing Convex deployment URL. Set NEXT_PUBLIC_CONVEX_URL or CONVEX_URL, or provide CONVEX_DEPLOYMENT."
  );
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

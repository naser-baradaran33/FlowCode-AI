"use client";

import { 
  Authenticated, 
  Unauthenticated,
  ConvexReactClient,
  AuthLoading, 
} from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useMemo } from "react";

import { UnauthenticatedView } from "@/features/auth/components/unauthenticated-view";
import { AuthLoadingView } from "@/features/auth/components/auth-loading-view";

import { ThemeProvider } from "./theme-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const convexUrl =
    process.env.NEXT_PUBLIC_CONVEX_URL?.trim() ??
    process.env.CONVEX_URL?.trim() ??
    (process.env.CONVEX_DEPLOYMENT?.trim()
      ? `https://${process.env.CONVEX_DEPLOYMENT.trim()}.convex.cloud`
      : undefined);

  if (!convexUrl) {
    throw new Error(
      "Missing Convex URL. Set NEXT_PUBLIC_CONVEX_URL/CONVEX_URL or CONVEX_DEPLOYMENT."
    );
  }

  const convex = useMemo(() => new ConvexReactClient(convexUrl), [convexUrl]);

  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
         <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Authenticated>
            {children}
          </Authenticated>
          <Unauthenticated>
            <UnauthenticatedView />
          </Unauthenticated>
          <AuthLoading>
            <AuthLoadingView />
          </AuthLoading>
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

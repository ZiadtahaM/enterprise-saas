import { QueryClient } from "@tanstack/react-query";
import { getToken, clearAuth } from "./auth";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        if ((error as { status?: number })?.status === 401) return false;
        return failureCount < 2;
      },
      staleTime: 30_000,
    },
  },
});

export function setupFetchInterceptor() {
  const originalFetch = window.fetch;
  window.fetch = async (input, init = {}) => {
    const token = getToken();
    if (token) {
      init.headers = {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${token}`,
      };
    }
    const response = await originalFetch(input, init);
    if (response.status === 401) {
      clearAuth();
      queryClient.clear();
      window.location.href = "/login";
    }
    return response;
  };
}

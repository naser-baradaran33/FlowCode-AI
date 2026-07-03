import { HTTPError } from "ky";

type ErrorPayload = {
  error?: unknown;
  message?: unknown;
};

export const readHttpError = async (error: HTTPError) => {
  const { response } = error;
  let message: string | undefined;

  if (!response.bodyUsed) {
    try {
      const payload = (await response.json()) as ErrorPayload;
      if (typeof payload.error === "string") {
        message = payload.error;
      } else if (typeof payload.message === "string") {
        message = payload.message;
      }
    } catch {
      message = undefined;
    }
  }

  return {
    status: response.status,
    message,
  };
};

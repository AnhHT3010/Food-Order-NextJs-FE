/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "@/hooks/use-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration = 5000,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  const showToast = (
    message: string,
    variant: "default" | "destructive" = "default"
  ) => {
    toast({
      title: "Lỗi",
      description: message,
      variant,
      duration,
    });
  };

  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach(({ field, message }) =>
      setError(field, { type: "server", message })
    );
  } else {
    showToast(error?.payload?.message ?? "Đã có lỗi xảy ra", "destructive");
  }
};
const isBrowser = typeof window !== "undefined";
export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("accessToken") : null;
};
export const getRefreshTokenToLocalStorage = () => {
  return isBrowser ? localStorage.getItem("refreshToken") : null;
};

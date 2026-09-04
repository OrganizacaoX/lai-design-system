"use client";

import type { CSSProperties, ReactElement, ReactNode } from "react";
import {
  toast,
  Toaster as Sonner,
  type ExternalToast,
  type ToastT,
  type ToasterProps,
  useSonner,
} from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

import { useTheme } from "@/components/theme-provider";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

type ToastId = string | number;
type ToastMessage = ReactNode | (() => ReactNode);
type ToastPromiseResult<Data = unknown> =
  | ReactNode
  | string
  | ((data: Data) => ReactNode | string | Promise<ReactNode | string>);
type ToastPromiseExtendedResult = ExternalToast & {
  message: ReactNode;
};
type ToastPromiseExtendedResolver<Data = unknown> = (
  data: Data,
) => ToastPromiseExtendedResult | Promise<ToastPromiseExtendedResult>;

type ToastPromiseOptions<Data = unknown> = Omit<ExternalToast, "description"> & {
  loading?: ReactNode | string;
  success?: ToastPromiseResult<Data> | ToastPromiseExtendedResolver<Data>;
  error?: ToastPromiseResult | ToastPromiseExtendedResolver;
  description?: ToastPromiseResult<Data>;
  finally?: () => void | Promise<void>;
};

type ToastPromiseHandle<Data> = {
  unwrap: () => Promise<Data>;
};
type ToastPromiseId<Data> =
  | (string & ToastPromiseHandle<Data>)
  | (number & ToastPromiseHandle<Data>)
  | ToastPromiseHandle<Data>;

type ToastApi = {
  (message: ToastMessage, data?: ExternalToast): ToastId;
  success: (message: ToastMessage, data?: ExternalToast) => ToastId;
  info: (message: ToastMessage, data?: ExternalToast) => ToastId;
  warning: (message: ToastMessage, data?: ExternalToast) => ToastId;
  error: (message: ToastMessage, data?: ExternalToast) => ToastId;
  loading: (message: ToastMessage, data?: ExternalToast) => ToastId;
  message: (message: ToastMessage, data?: ExternalToast) => ToastId;
  custom: (
    content: (id: ToastId) => ReactElement,
    data?: ExternalToast,
  ) => ToastId;
  promise: <Data>(
    promise: Promise<Data> | (() => Promise<Data>),
    data?: ToastPromiseOptions<Data>,
  ) => ToastPromiseId<Data>;
  dismiss: (id?: ToastId) => ToastId;
};

type UseToastResult = {
  toast: ToastApi;
  toasts: ToastT[];
  dismiss: ToastApi["dismiss"];
};

const toastApi: ToastApi = toast;

function useToast(): UseToastResult {
  const { toasts } = useSonner();

  return {
    toast: toastApi,
    toasts,
    dismiss: toastApi.dismiss,
  };
}

export { Toaster, useToast };
export type { ToastApi, ToastPromiseOptions, UseToastResult };

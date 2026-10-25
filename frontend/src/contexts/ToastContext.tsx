import React, { createContext, useContext } from "react";
import {
  Toaster,
  useToastController,
  Toast,
  ToastTitle,
  ToastIntent,
  useId,
} from "@fluentui/react-components";

interface ToastContextValue {
  showToast: (message: string, intent?: ToastIntent) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);

  const showToast = (message: string, intent: ToastIntent = "success") => {
    dispatchToast(
      <Toast>
        <ToastTitle>{message}</ToastTitle>
      </Toast>,
      { intent }
    );
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <>
        {children}
        <Toaster toasterId={toasterId} />
      </>
    </ToastContext.Provider>
  );
};

export const useAppToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useAppToast must be used within a ToastProvider");
  }
  return context;
};

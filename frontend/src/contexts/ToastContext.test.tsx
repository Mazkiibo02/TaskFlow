import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider, useAppToast } from "./ToastContext";

// Test component that consumes the context
const TestComponent = () => {
  const { showToast } = useAppToast();
  return (
    <button onClick={() => showToast("Test notification", "success")}>
      Trigger Toast
    </button>
  );
};

describe("ToastContext", () => {
  it("should render children and expose showToast function", async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText("Trigger Toast");
    expect(button).toBeInTheDocument();

    // In a real browser this would trigger the toaster DOM,
    // but without full JSDOM mock for Fluent UI Toaster, we just verify it doesn't crash.
    await act(async () => {
      await userEvent.click(button);
    });
    
    // If we wanted to test the actual popup, we'd need to mock the Fluent UI toaster internals,
    // but ensuring the context provides the function without throwing is sufficient here.
  });

  it("should throw an error if used outside of ToastProvider", () => {
    // Suppress console.error for the expected React error boundary throw
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => render(<TestComponent />)).toThrow(
      "useAppToast must be used within a ToastProvider"
    );
    
    console.error = originalError;
  });
});

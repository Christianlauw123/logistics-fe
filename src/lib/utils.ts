import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/* Global Helper*/
export function errorHandler(error: any) {
  // 1. Safely extract the inner response object based on your network layer
  // Checks Axios style data wrapper, falling back to direct access
  const backendData = error?.response?.data || error;
  const validationErrors = backendData?.errors;

  // 2. Fallback message array
  const errorMessageLines: string[] = [];

  if (validationErrors && typeof validationErrors === "object") {
    // 3. Loop through keys (e.g. 'amount') and array values
    Object.entries(validationErrors).forEach(([_, messages]) => {
      if (Array.isArray(messages)) {
        // Combines all string items inside the array cleanly
        errorMessageLines.push(`${messages.join(", ")}`);
      } else if (typeof messages === "string") {
        errorMessageLines.push(`${messages}`);
      }
    });
  }

  // 4. If we extracted custom messages, display them; otherwise, use a fallback
  if (errorMessageLines.length > 0) {
    // Joins separate keys with a line break or comma space
    toast.error(errorMessageLines.join(" | "));
  } else {
    // Standard error description handling
    toast.error(backendData?.message || "");
  }
}

export const allowedRoles = ['Super Admin', 'Staff', 'Operational']
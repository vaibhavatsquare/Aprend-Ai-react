/**
 * Error handler utility for authentication-related errors
 * Provides user-friendly error messages based on error types and codes
 */

export interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
      code?: string;
    };
  };
  message?: string;
}

export const ERROR_MESSAGES = {
  // Email/User not found
  USER_NOT_FOUND: "No account exists with this email address. Please check and try again.",
  EMAIL_NOT_REGISTERED: "This email is not registered. Please sign up first.",
  USER_DOES_NOT_EXIST: "User account not found.",
  
  // OTP errors
  INVALID_OTP: "The verification code you entered is incorrect. Please try again.",
  OTP_EXPIRED: "The verification code has expired. Please request a new one.",
  TOO_MANY_OTP_ATTEMPTS: "Too many failed attempts. Please try again later.",
  OTP_NOT_SENT: "Could not send verification code. Please try again.",
  
  // Password errors
  PASSWORD_RESET_FAILED: "Failed to reset password. Please try again.",
  WEAK_PASSWORD: "Password does not meet security requirements. Please use a stronger password.",
  PASSWORDS_DO_NOT_MATCH: "Passwords do not match. Please try again.",
  
  // Network errors
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  SERVER_ERROR: "Server error. Please try again later.",
  
  // Generic
  DEFAULT_ERROR: "An error occurred. Please try again.",
};

/**
 * Maps API error response to a user-friendly message
 * @param error - The error object from API
 * @returns User-friendly error message
 */
export const getAuthErrorMessage = (error: any): string => {
  // Handle network errors
  if (!error.response) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  const status = error.response?.status;
  const message = error.response?.data?.message || error.message || "";
  const errorCode = error.response?.data?.code;
  const messageLower = message.toLowerCase();

  // 404 - User not found
  if (status === 404) {
    return ERROR_MESSAGES.USER_NOT_FOUND;
  }

  // 400 - Bad request (could be validation error)
  if (status === 400) {
    if (messageLower.includes("not found") || 
        messageLower.includes("no account") || 
        messageLower.includes("not registered") ||
        messageLower.includes("user does not exist") ||
        messageLower.includes("email not exist")) {
      return ERROR_MESSAGES.USER_NOT_FOUND;
    }

    if (messageLower.includes("invalid otp") || 
        messageLower.includes("incorrect code") ||
        messageLower.includes("wrong otp")) {
      return ERROR_MESSAGES.INVALID_OTP;
    }

    if (messageLower.includes("expired")) {
      return ERROR_MESSAGES.OTP_EXPIRED;
    }

    if (messageLower.includes("too many")) {
      return ERROR_MESSAGES.TOO_MANY_OTP_ATTEMPTS;
    }

    if (messageLower.includes("weak") || messageLower.includes("strength")) {
      return ERROR_MESSAGES.WEAK_PASSWORD;
    }
  }

  // 401 - Unauthorized
  if (status === 401) {
    return ERROR_MESSAGES.USER_NOT_FOUND;
  }

  // 429 - Too many requests
  if (status === 429) {
    return ERROR_MESSAGES.TOO_MANY_OTP_ATTEMPTS;
  }

  // 500+ - Server errors
  if (status && status >= 500) {
    return ERROR_MESSAGES.SERVER_ERROR;
  }

  // Check error message content for specific keywords
  if (messageLower.includes("not found") || 
      messageLower.includes("no account") || 
      messageLower.includes("not registered") ||
      messageLower.includes("user does not exist") ||
      messageLower.includes("email not exist")) {
    return ERROR_MESSAGES.USER_NOT_FOUND;
  }

  if (messageLower.includes("invalid otp") || 
      messageLower.includes("incorrect code") ||
      messageLower.includes("wrong otp")) {
    return ERROR_MESSAGES.INVALID_OTP;
  }

  if (messageLower.includes("otp") && messageLower.includes("expired")) {
    return ERROR_MESSAGES.OTP_EXPIRED;
  }

  if (messageLower.includes("too many")) {
    return ERROR_MESSAGES.TOO_MANY_OTP_ATTEMPTS;
  }

  if (messageLower.includes("password")) {
    if (messageLower.includes("weak") || messageLower.includes("strength")) {
      return ERROR_MESSAGES.WEAK_PASSWORD;
    }
    if (messageLower.includes("match")) {
      return ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH;
    }
    return ERROR_MESSAGES.PASSWORD_RESET_FAILED;
  }

  // If we have a message that looks user-friendly, use it
  if (message && !messageLower.includes("error") && message.length < 100) {
    return message;
  }

  return ERROR_MESSAGES.DEFAULT_ERROR;
};

/**
 * Extract structured error information for debugging
 * @param error - The error object
 * @returns Object with error details
 */
export const getErrorDetails = (error: any) => {
  return {
    status: error?.response?.status,
    message: error?.response?.data?.message || error?.message,
    code: error?.response?.data?.code,
    fullError: error,
  };
};
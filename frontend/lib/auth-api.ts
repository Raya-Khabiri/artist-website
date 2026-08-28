import type {
    AuthSession,
    LoginCredentials,
    LoginResponse,
    RegisterData,
    RegisterResponse,
    AuthUser,
} from "@/types/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();

    if (typeof data.detail === "string") {
      return data.detail;
    }

    const firstError = Object.values(data).flat()[0];

    if (typeof firstError === "string") {
      return firstError;
    }
  } catch {
    // Response did not contain valid JSON.
  }

  return "Something went wrong. Please try again.";
}

export async function loginUser(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function registerUser(
  userData: RegisterData,
): Promise<RegisterResponse> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function logoutUser(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to log out.");
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    cache: "no-store",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load the current user.");
  }

  return response.json();
}
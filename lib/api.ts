import { toast } from "sonner";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function registerUser(formData: {
  fullName: string;
  email: string;
  password: string;
}) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: "CANDIDATE",
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      toast.error("Registration failed", {
    description: data.message || "Something went wrong",
      });
      return null;
    }

    toast.success("Account created 🎉", {
      description: data.message || "Welcome to cxJobs!",
    });

    return data; // ✅ return parsed response
  } catch (error: any) {
    toast.error("Registration failed", {
      description: error.message || "Something went wrong. Please try again.",
    });
    return null;
  }
}
export async function completeOnboarding(profileData: any) {
  const response = await fetch("/api/onboarding", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileData }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to save profile");
  }

  return data;
}
export interface ProfileData {
  id: string;
  name: string;
  email?: string;
  // Add other fields you expect from the backend
}

export async function getProfileData(): Promise<ProfileData | null> {
  try {
    const response = await fetch("/api/onboarding")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.profileData || null
  } catch (error) {
    console.error("Error fetching profile data:", error)
    return null
  }
}
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(data.error || "An error occurred", response.status, data.details)
  }

  return data
}

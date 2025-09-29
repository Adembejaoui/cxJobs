/**
 * Email verification utility using Abstract API
 * Checks if an email address is deliverable before allowing registration/login
 */

interface AbstractEmailResponse {
  email: string
  autocorrect: string
  deliverability: string
  quality_score: number
  is_valid_format: {
    value: boolean
    text: string
  }
  is_free_email: {
    value: boolean
    text: string
  }
  is_disposable_email: {
    value: boolean
    text: string
  }
  is_role_email: {
    value: boolean
    text: string
  }
  is_catchall_email: {
    value: boolean
    text: string
  }
  is_mx_found: {
    value: boolean
    text: string
  }
  is_smtp_valid: {
    value: boolean
    text: string
  }
}

/**
 * Verifies email deliverability using Abstract API
 * @param email - The email address to verify
 * @returns Promise<boolean> - true if email is deliverable, false otherwise
 */
export async function verifyEmailZeroBounce(email: string) {
  const apiKey = process.env.ZERBOUNCE_API_KEY;
  if (!apiKey) throw new Error("Missing ZeroBounce API key");

  const res = await fetch(
    `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${email}`
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("ZeroBounce API error:", text);
    throw new Error(`API request failed: ${res.statusText}`);
  }

  const data = await res.json();
  console.log("ZeroBounce response:", data);

  // Consider email valid if status is "valid" and not disposable
  return data.status === "valid" && !data.disposable;
}

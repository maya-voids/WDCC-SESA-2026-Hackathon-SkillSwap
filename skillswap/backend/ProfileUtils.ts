// Utilities for the signed-in user's profile, e.g. their credit balance.
// The balance is persisted to backend/dataStorage/profile.json via the
// /profile.json endpoint, so it survives a page refresh.

const PROFILE_ENDPOINT = "/profile.json";

/** Read the current credit balance from the server. */
export async function getCredits(): Promise<number> {
  const response = await fetch(PROFILE_ENDPOINT);
  if (!response.ok) {
    throw new Error(`Failed to load credits (${response.status})`);
  }
  const profile = (await response.json()) as { credits: number };
  return profile.credits;
}

/**
 * Change the credit balance by `amount` (positive earns, negative spends),
 * persist the new balance, and return it.
 */
export async function changeCredits(amount: number): Promise<number> {
  const current = await getCredits();
  const next = current + amount;

  const formData = new FormData();
  formData.append("credits", String(next));

  const response = await fetch(PROFILE_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let serverMessage = "";

    try {
      const payload = (await response.json()) as { error?: unknown };
      if (typeof payload.error === "string") {
        serverMessage = `: ${payload.error}`;
      }
    } catch {
      // The status code still provides a useful error when the body is not JSON.
    }

    throw new Error(
      `Failed to save credits (${response.status})${serverMessage}`,
    );
  }

  return next;
}

import { auth } from "@clerk/nextjs/server";

/**
 * Shared secret used by server-to-server (internal) API calls
 * to bypass Clerk auth.  Falls back to a hard-coded dev-only value
 * so local development works without extra env config.
 */
const INTERNAL_SECRET =
  process.env.INTERNAL_API_SECRET ?? "dev-internal-secret-do-not-use-in-prod";

export const INTERNAL_AUTH_HEADER = "x-internal-secret";

/**
 * Verify that the caller is either:
 *  1. A logged-in Clerk user, OR
 *  2. An internal server-to-server call carrying the shared secret.
 *
 * Returns the userId (string) or null if unauthorized.
 */
export async function verifyInternalOrClerkAuth(
  req: Request,
): Promise<string | null> {
  // Check for internal secret header first (server-to-server)
  const internalSecret = req.headers.get(INTERNAL_AUTH_HEADER);
  if (internalSecret === INTERNAL_SECRET) {
    return "__internal__";
  }

  // Otherwise fall back to Clerk auth (browser calls)
  const { userId } = await auth();
  return userId;
}

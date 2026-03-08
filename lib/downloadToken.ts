import crypto from "crypto";

const SECRET_KEY = process.env.DOWNLOAD_SECRET_KEY || "your-secret-key-change-in-production";

export interface DownloadToken {
  projectId: number;
  userId?: string;
  expiresAt: number;
}

export function generateDownloadToken(projectId: number, userId?: string): string {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
  
  const payload: DownloadToken = {
    projectId,
    userId,
    expiresAt,
  };

  const payloadString = JSON.stringify(payload);
  const payloadBase64 = Buffer.from(payloadString).toString("base64");
  
  // Create HMAC signature
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(payloadBase64)
    .digest("hex");

  return `${payloadBase64}.${signature}`;
}

export function verifyDownloadToken(token: string): DownloadToken | null {
  try {
    const [payloadBase64, signature] = token.split(".");
    
    if (!payloadBase64 || !signature) {
      return null;
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(payloadBase64)
      .digest("hex");

    if (signature !== expectedSignature) {
      return null;
    }

    // Decode payload
    const payloadString = Buffer.from(payloadBase64, "base64").toString("utf-8");
    const payload: DownloadToken = JSON.parse(payloadString);

    // Check expiration
    if (Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error("Error verifying download token:", error);
    return null;
  }
}

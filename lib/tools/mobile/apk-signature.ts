function bufferToHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToColon(hex: string): string {
  return hex.match(/.{1,2}/g)?.join(":").toUpperCase() ?? hex.toUpperCase();
}

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function pemToDer(pem: string): Uint8Array {
  const cleaned = pem
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "")
    .replace(/\s+/g, "");
  const binary = atob(cleaned);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function looksLikePem(text: string): boolean {
  return /-----BEGIN [^-]+-----/.test(text);
}

export interface CertificateFingerprints {
  sha1: string;
  sha1Colon: string;
  sha256: string;
  sha256Colon: string;
  sha1Base64: string;
  sha256Base64: string;
  byteLength: number;
}

export async function fingerprintsFromBytes(
  bytes: ArrayBuffer | Uint8Array
): Promise<CertificateFingerprints> {
  const source =
    bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const view = new Uint8Array(source.byteLength);
  view.set(source);

  const [sha1Buf, sha256Buf] = await Promise.all([
    crypto.subtle.digest("SHA-1", view),
    crypto.subtle.digest("SHA-256", view),
  ]);

  const sha1 = bufferToHex(sha1Buf);
  const sha256 = bufferToHex(sha256Buf);

  return {
    sha1,
    sha1Colon: hexToColon(sha1),
    sha256,
    sha256Colon: hexToColon(sha256),
    sha1Base64: bufferToBase64(sha1Buf),
    sha256Base64: bufferToBase64(sha256Buf),
    byteLength: view.byteLength,
  };
}

export async function fingerprintsFromPemOrFile(
  input: string | ArrayBuffer
): Promise<CertificateFingerprints> {
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) throw new Error("Paste a PEM certificate or upload a file.");
    if (looksLikePem(trimmed)) {
      return fingerprintsFromBytes(pemToDer(trimmed));
    }
    // Treat as raw hex of certificate DER
    const hex = trimmed.replace(/[\s:]+/g, "");
    if (!/^[0-9a-fA-F]+$/.test(hex) || hex.length % 2 !== 0) {
      throw new Error("Invalid input. Provide PEM text or a .cer/.crt/.der/.pem file.");
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return fingerprintsFromBytes(bytes);
  }
  return fingerprintsFromBytes(input);
}

export function keytoolHint(alias = "androiddebugkey"): string {
  return `# Debug keystore
keytool -list -v -keystore ~/.android/debug.keystore -alias ${alias} -storepass android -keypass android

# Release keystore
keytool -list -v -keystore your-release.keystore -alias your-alias`;
}

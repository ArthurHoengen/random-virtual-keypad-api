const keyBase64 = import.meta.env.VITE_ENCRYPTION_KEY;
const ivHex = import.meta.env.VITE_ENCRYPTION_IV;

export async function encrypt(data) {
  try {
    const keyBuffer = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0));

    const key = await crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );

    const iv = hexStringToBytes(ivHex);

    const jsonString = JSON.stringify(data);

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv, tagLength: 128 },
      key,
      new TextEncoder().encode(jsonString)
    );

    const encryptedBytes = new Uint8Array(encrypted);
    const authTag = encryptedBytes.slice(-16);
    const encryptedData = encryptedBytes.slice(0, -16);

    const encryptedDataHex = bytesToHexString(encryptedData);
    const authTagHex = bytesToHexString(authTag);

    return { encryptedData: encryptedDataHex, authTag: authTagHex };
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Encryption failed");
  }
}

function bytesToHexString(byteArray) {
  return Array.from(byteArray)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function hexStringToBytes(hexString) {
  const byteArray = [];
  for (let i = 0; i < hexString.length; i += 2) {
    byteArray.push(parseInt(hexString.substr(i, 2), 16));
  }
  return new Uint8Array(byteArray);
}

export async function decrypt(encryptedData, authTagHex) {
  try {
    const keyBuffer = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0));

    const key = await crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    const iv = hexStringToBytes(ivHex);
    const authTag = hexStringToBytes(authTagHex);
    const encryptedBytes = hexStringToBytes(encryptedData);

    const combinedData = new Uint8Array([...encryptedBytes, ...authTag]);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv, tagLength: 128 },
      key,
      combinedData
    );

    return JSON.parse(new TextDecoder().decode(decrypted));
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Decryption failed");
  }
}

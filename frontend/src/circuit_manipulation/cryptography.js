export async function sha256Hash(inputArray) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", inputArray);
    return new Uint8Array(hashBuffer);
}
/**
 * Converts a fileKey from the Database into a complete fileUrl for Frontend display.
 * Handles "double slash" errors or incorrect URL storage.
 */
export function generateFileUrl(fileKey: string, baseUrl: string): string {
  if (!fileKey) return ''; // Return an empty string if there is no key

  const isInvalid =
    !fileKey || fileKey.startsWith('http') || fileKey.includes('://');

  if (isInvalid) {
    console.error(`[Security Warning]: Detected invalid fileKey: ${fileKey}`);
    return 'https://your-domain.com/static/invalid-file-format.png';
  }
  // IMPORTANT STEP: Clean up the strings
  // 1. Remove the trailing '/' from baseUrl (if someone accidentally added it in the .env file)
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');

  // 2. Remove the leading '/' from fileKey (if any)
  const cleanKey = fileKey.replace(/^\//, '');

  // Rejoin with a single '/'
  return `${cleanBaseUrl}/${cleanKey}`;
}

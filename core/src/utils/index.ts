/**
 * Extracts the domain from a given URL.
 * @param url - The full website URL.
 * @returns The domain name.
 */
export function extractDomain(url: string): string {
    let inputUrl = url.trim()
        
    // If the input does not start with a protocol, prepend "http://"
    if (!/^[a-zA-Z]+:\/\//.test(inputUrl)) {
        inputUrl = "http://" + inputUrl; // Assume HTTP for parsing
    }

    try {
        const parsedUrl = new URL(inputUrl);
        return parsedUrl.hostname.replace(/^www\./, ""); // Remove 'www.'
    } catch (error) {
        throw new Error("Invalid URL");
    }
}

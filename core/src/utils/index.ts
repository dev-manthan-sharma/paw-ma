/**
 * ==================================================
 * Copyright 2025 : The @dev-manthan-sharma/paw-ma Authors
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ==================================================
 */

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

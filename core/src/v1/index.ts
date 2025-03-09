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

import CryptoJS from "crypto-js"
import { extractDomain } from "../utils/index"

/**
 * Represents the result structure returned by the main function.
 *
 * @property url - The original URL provided to the main function.
 * @property masterPassword - The master password provided to the main function.
 * @property differentiator - An account-specific differentiator (e.g., username, email, or other account info)
 *                            used to generate distinct passwords for the same domain.
 * @property domain - The extracted domain from the provided URL (if successfully extracted).
 * @property generatedPassword - The deterministic password generated based on the extracted domain and master password (if generated successfully).
 * @property error - An error message in case of a failure during processing.
 */
type V1 = {
    url?: string;
    masterPassword?: string;
    differentiator?: string;
    domain?: string;
    generatedPassword?: string;
    error?: string;
}

namespace v1 {

    /**
     * Generates a deterministic password based on an identifier, differentiator and master password.
     * The function uses multiple rounds of HMAC-SHA256 to generate a seed,
     * which in turn is used by a deterministic pseudo‑random generator to pick characters.
     *
     * @param identifier - A unique identifier (e.g., a domain, service name, or any context).
     * @param masterPassword - The user's secret password.
     * @param differentiator - An account-specific differentiator (e.g., username, email, or other account info)
     *                         used to generate distinct passwords for the same identifier.
     * @returns A generated password meeting common complexity rules.
     */
    function generatePassword(identifier: string, masterPassword: string, differentiator: string = ""): string {
        // Check is Master Password Exists
        if (!masterPassword) {
            throw new Error(`Master Password Required`);
        }

        // Character sets for each category.
        const uppercaseCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercaseCharacters = "abcdefghijklmnopqrstuvwxyz";
        const numberCharacters = "0123456789";
        const specialCharacters = "!@#$%^&*()_+[]{}|;:,.<>?/~`-=";

        // Minimum required characters for each category.
        const minUppercase = 2;
        const minLowercase = 2;
        const minNumbers = 2;
        const minSpecial = 2;

        // Desired total password length.
        const passwordLength = 16;
        const requiredLength = minUppercase + minLowercase + minNumbers + minSpecial;
        if (passwordLength < requiredLength) {
            throw new Error(`Password length must be at least ${requiredLength}`);
        }

        // Fixed salt and number of rounds for the seed derivation.
        const salt = "cb6bea251f8876f3163a1bff96a6184f3c3a0a733d3f23f5f650018603fe0205";
        const rounds = 1021;

        // Create a combined seed from the inputs.
        let seed = identifier + masterPassword + salt;
        // "Stretch" the seed using multiple rounds of HMAC-SHA256.
        for (let i = 0; i < rounds; i++) {
            seed = CryptoJS.HmacSHA256(seed + differentiator, masterPassword).toString(CryptoJS.enc.Hex);
        }

        // Deterministic pseudo‑random number generator using the final seed.
        let counter = 0;
        function deterministicRandom(): number {
            const hmac = CryptoJS.HmacSHA256((counter++).toString(), seed).toString(CryptoJS.enc.Hex);
            // Return a value between 0 and 255 by converting the first two hex characters.
            return parseInt(hmac.substring(0, 2), 16);
        }

        // Helper: Get a pseudo-random character from a given character set.
        function getRandomChar(charSet: string): string {
            const rand = deterministicRandom();
            const index = rand % charSet.length;
            return charSet.charAt(index);
        }

        // Build the password array ensuring minimum requirements.
        const passwordChars: string[] = [];

        // Add minimum required uppercase characters.
        for (let i = 0; i < minUppercase; i++) {
            passwordChars.push(getRandomChar(uppercaseCharacters));
        }
        // Add minimum required lowercase characters.
        for (let i = 0; i < minLowercase; i++) {
            passwordChars.push(getRandomChar(lowercaseCharacters));
        }
        // Add minimum required numbers.
        for (let i = 0; i < minNumbers; i++) {
            passwordChars.push(getRandomChar(numberCharacters));
        }
        // Add minimum required special characters.
        for (let i = 0; i < minSpecial; i++) {
            passwordChars.push(getRandomChar(specialCharacters));
        }

        // Combine all character sets for the remaining characters.
        const allCharacters =
            uppercaseCharacters + lowercaseCharacters + numberCharacters + specialCharacters;
        while (passwordChars.length < passwordLength) {
            passwordChars.push(getRandomChar(allCharacters));
        }

        // Deterministically shuffle the array using the Fisher-Yates algorithm.
        for (let i = passwordChars.length - 1; i > 0; i--) {
            const j = deterministicRandom() % (i + 1);
            [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
        }

        return passwordChars.join("");
    }

    /**
     * Main function to generate a deterministic password from a given URL and master password, and account differentiator.
     *
     * This function first extracts the domain from the provided URL and then uses the domain
     * along with the user's master password and an account-specific differentiator to generate 
     * a deterministic password. The generated password adheres to common complexity rules, ensuring 
     * it includes a mix of uppercase, lowercase, numeric, and special characters. Since the process 
     * is deterministic, the same URL and master password will always produce the same output.
     *
     * @param url - A valid URL from which the domain is extracted.
     * @param masterPassword - The user's secret master password used to generate the password.
     * @param differentiator - An optional account-specific differentiator (e.g., username, email, or other account info)
     *                         used to generate distinct passwords for the same domain.
     * @returns An object of type V1 containing:
     *            - url: the original URL provided.
     *            - masterPassword: the master password provided.
     *            - differentiator: the account-specific differentiator provided (if any).
     *            - domain: the extracted domain from the URL (if extraction is successful).
     *            - generatedPassword: the deterministic password generated based on the extracted domain
     *              and the master password (if generation is successful).
     *            - error: an error message if any error occurred during processing.
     */
    export function main(url: string, masterPassword: string, differentiator?: string): V1 {
        try {
            const domain = extractDomain(url);
            const generatedPassword = generatePassword(domain, masterPassword, differentiator);
            return { url, masterPassword, differentiator, domain, generatedPassword };
        } catch (e) {
            return { url, masterPassword, error: e instanceof Error ? e.message : String(e) };
        }
    }
}

export default v1.main;
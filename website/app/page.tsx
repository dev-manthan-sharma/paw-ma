"use client";

import { FormEvent, useState, useEffect } from "react";
import core from "@dev-manthan-sharma/paw-ma--core";

/**
 * Renders the Home Page
 * @returns - Home Page
 */
export default function Home() {
  const [url, setUrl] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [domainFound, setDomainFound] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // If either Url or Master Password are empty clear derived states
    if (!url || !masterPassword) {
      setDomainFound("");
      setGeneratedPassword("");
      setError("");
    }

    // If both Url and Master Password are not empty run v1 code and update derived states
    if (url || masterPassword) {
      const v1 = core.v1(url, masterPassword);
      setDomainFound(v1.domain || "");
      setGeneratedPassword(v1.generatedPassword || "");
      setError(v1.error || "");
    }
  }, [url, masterPassword]);

  // Function to handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //Copy Generated Password
    setIsCopied(true)
    navigator.clipboard.writeText(generatedPassword);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000)
  };

  return (
    <div className="grid grid-cols-12">
      {/* Main Content */}
      <main className="col-span-12">
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-start justify-center p-8 sm:p-12 md:p-20 md:pb-2 bg-black">
          <div className="flex-auto grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8 w-full">
            <div className="lg:col-span-2 text-white self-center">
              <h1 className="text-4xl font-bold">Paw-Ma</h1>
              <p className="text-xl pt-10">
                A Simple Password Manager
                <br />
                <br />
                Use one Master Password to create multiple passwords
                <br />
                So you don’t have to remember all the passwords for all the
                websites or just use one password for all the websites
                <br />
                <br />
                Just copy the link of the website you want to create password
                for and paste it here, then type your master password, and it
                will create a password just for you
              </p>
            </div>
            <div className="rounded-3xl lg:col-span-2 bg-gray-100 drop-shadow-md shadow-lg shadow-white/50 flex flex-col items-start justify-center self-center">
              <form className="w-full p-8" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value.trim());
                  }}
                  placeholder="URL"
                  required
                  autoComplete="off"
                  className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                />
                <input
                  type="password"
                  name="master"
                  value={masterPassword}
                  onChange={(e) => {
                    setMasterPassword(e.target.value.trim());
                  }}
                  placeholder="Master Password"
                  required
                  autoComplete="off"
                  className="w-full p-2 mt-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                />
                <input
                  type="text"
                  name="domain"
                  value={domainFound}
                  placeholder="Domain"
                  disabled
                  autoComplete="off"
                  className="w-full p-2 mt-8 border-2 bg-gray-200 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                />
                <input
                  type="text"
                  name="password"
                  value={generatedPassword}
                  placeholder="Password"
                  disabled
                  autoComplete="off"
                  className="w-full p-2 mt-4 border-2 bg-gray-200 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                />

                <button
                  type="submit"
                  disabled={error.length !== 0}
                  className={`w-full mt-8 rounded-md ${
                    error.length
                      ? "bg-red-800 hover:bg-red-700"
                      : "bg-gray-900 hover:bg-gray-600"
                  } px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400`}
                >
                  {error || (isCopied ? "Copied" : "Copy")}
                </button>
              </form>
            </div>
          </div>

          <div className="mx-auto max-w-5xl mt-4">
            <p className="text-center text-gray-400">
              Made with ❤️ by Manthan Sharma
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

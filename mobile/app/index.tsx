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

import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import Feather from "@expo/vector-icons/Feather";
import core from "@dev-manthan-sharma/paw-ma--core";
import packageInfo from "../package.json";

export default function Index() {
  const [url, setUrl] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [isMasterPasswordVisible, setIsMasterPasswordVisible] = useState(false);
  const [accountDifferentiator, setAccountDifferentiator] = useState("");
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
      const v1 = core.v1(url, masterPassword, accountDifferentiator);
      setDomainFound(v1.domain || "");
      setGeneratedPassword(v1.generatedPassword || "");
      setError(v1.error || "");
    }
  }, [url, masterPassword, accountDifferentiator]);

  // Function to handle ButtonPress
  const handleButtonPress = async () => {
    //Copy Generated Password
    setIsCopied(true);
    Clipboard.setStringAsync(generatedPassword);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#000",
        padding: 16,
      }}
    >
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#fff", fontSize: 60, fontWeight: "900" }}>
            Paw-Ma
          </Text>
          <Text style={{ color: "#fff", fontSize: 20 }}>
            A Simple Password Manager
          </Text>
        </View>

        <View
          style={{
            marginTop: 36,
            backgroundColor: "#f3f4f6",
            borderRadius: 16,
            paddingHorizontal: 24,
            paddingVertical: 36,
            width: "90%",
            overflow: "hidden",
          }}
        >
          <TextInput
            value={url}
            onChangeText={(text) => setUrl(text.trim())}
            placeholder="URL"
            style={{
              fontSize: 20,
              padding: 12,
              borderRadius: 16,
              borderColor: "#d1d5dc",
              borderWidth: 1,
            }}
            multiline={true}
            autoCapitalize="none"
            autoComplete="off"
          />
          <View
            style={{
              flexDirection: "row",
              marginTop: 24,
              padding: 12,
              borderRadius: 16,
              borderColor: "#d1d5dc",
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextInput
              value={masterPassword}
              onChangeText={(text) => setMasterPassword(text.trim())}
              placeholder="Master Password"
              style={{
                flex: 1,
                fontSize: 20,
                paddingEnd: 12,
              }}
              numberOfLines={1}
              autoCapitalize="none"
              autoComplete="off"
              secureTextEntry={!isMasterPasswordVisible}
            />
            <Pressable
              style={{
                borderRadius: 10,
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
              }}
              android_ripple={{
                color: "#4a5565",
                borderless: false,
                foreground: true,
              }}
              onPress={() => setIsMasterPasswordVisible((prev) => !prev)}
            >
              <Feather
                name={isMasterPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="#101828"
              />
            </Pressable>
          </View>
          <TextInput
            value={accountDifferentiator}
            onChangeText={(text) => setAccountDifferentiator(text.trim())}
            placeholder="Account Differentiator (Optional - always stick to one type: email, username, etc.)"
            style={{
              fontSize: 20,
              padding: 12,
              marginTop: 24,
              borderRadius: 16,
              borderColor: "#d1d5dc",
              borderWidth: 1
            }}
            multiline={true}
            autoCapitalize="none"
            autoComplete="off"
          />

          <TextInput
            value={domainFound}
            placeholder="Domain"
            style={{
              fontSize: 20,
              backgroundColor: "#e5e7eb",
              marginTop: 36,
              padding: 12,
              borderRadius: 16,
              borderColor: "#d1d5dc",
              borderWidth: 1,
            }}
            editable={false}
            multiline={true}
            autoCapitalize="none"
            autoComplete="off"
          />
          <TextInput
            value={generatedPassword}
            placeholder="Password"
            style={{
              fontSize: 20,
              backgroundColor: "#e5e7eb",
              marginTop: 24,
              padding: 12,
              borderRadius: 16,
              borderColor: "#d1d5dc",
              borderWidth: 1,
            }}
            editable={false}
            multiline={true}
            autoCapitalize="none"
            autoComplete="off"
          />
          <Pressable
            style={{
              backgroundColor: error ? "#9f0712" : "#101828",
              marginTop: 36,
              padding: 12,
              borderRadius: 16,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
            }}
            android_ripple={{
              color: error ? "#c10007" : "#4a5565",
              borderless: false,
              foreground: true,
            }}
            onPress={handleButtonPress}
            disabled={!!error || !(url && masterPassword)}
          >
            <Text style={{ color: "#fff", fontSize: 20 }}>
              {error || (isCopied ? "Copied" : "Copy")}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text
          style={{ color: "#99a1af", fontSize: 16 }}
          onPress={() => Linking.openURL("https://mscode.in/")}
        >
          Made with ❤️ by Manthan Sharma
        </Text>
        <Text
          style={{ color: "#99a1af", fontSize: 16, marginTop: 4 }}
          onPress={() =>
            Linking.openURL("https://github.com/dev-manthan-sharma/paw-ma")
          }
        >
          {"v" + packageInfo.version}
        </Text>
      </View>
    </View>
  );
}

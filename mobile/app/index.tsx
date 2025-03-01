import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import * as Clipboard from 'expo-clipboard';
import core from "@dev-manthan-sharma/paw-ma--core";

export default function Index() {
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
          />
          <TextInput
            value={masterPassword}
            onChangeText={(text) => setMasterPassword(text.trim())}
            placeholder="Master Password"
            style={{
              fontSize: 20,
              marginTop: 24,
              padding: 12,
              borderRadius: 16,
              borderColor: "#d1d5dc",
              borderWidth: 1,
            }}
            multiline={true}
            autoCapitalize="none"
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

      <Text style={{ color: "#99a1af", fontSize: 16 }}>
        Made with ❤️ by Manthan Sharma
      </Text>
    </View>
  );
}

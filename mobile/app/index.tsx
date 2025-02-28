import { Pressable, Text, TextInput, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
        padding: 16,
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
          placeholder="URL"
          style={{
            fontSize: 20,
            padding: 12,
            borderRadius: 16,
            borderColor: "#d1d5dc",
            borderWidth: 1
          }}
          multiline={true}
        />
        <TextInput
          placeholder="Master Password"
          style={{
            fontSize: 20,
            marginTop: 24,
            padding: 12,
            borderRadius: 16,
            borderColor: "#d1d5dc",
            borderWidth: 1
          }}
          multiline={true}
        />
        <TextInput
          placeholder="Domain"
          style={{
            fontSize: 20,
            backgroundColor: "#e5e7eb",
            marginTop: 36,
            padding: 12,
            borderRadius: 16,
            borderColor: "#d1d5dc",
            borderWidth: 1
          }}
          editable={false}
          multiline={true}
        />
        <TextInput
          placeholder="Password"
          style={{
            fontSize: 20,
            backgroundColor: "#e5e7eb",
            marginTop: 24,
            padding: 12,
            borderRadius: 16,
            borderColor: "#d1d5dc",
            borderWidth: 1
          }}
          editable={false}
          multiline={true}
        />
        <Pressable style={{
          backgroundColor: "#101828",
          marginTop: 36,
          padding: 12,
          borderRadius: 16,
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center"
        }} android_ripple={{color: "#4a5565", borderless: false, foreground: true}}>
          <Text style={{ color: "#fff", fontSize: 20 }}>
            Copy
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
